<?php
/**
 * Lead capture.
 *
 * The contact form and the scorecard's "send me the plan" form both post
 * here, to admin-post.php, instead of straight to Formspree. Straight-to-
 * Formspree had two failure modes that a prospect could see: the free plan
 * ignores the `_next` redirect, so people finished on a formspree.io page
 * instead of ours; and if the account was ever over quota or unverified, the
 * inquiry vanished with a 200.
 *
 * The order of operations is the point. The lead is written to the database
 * FIRST — as a private `fp_lead` post, visible under Leads in the admin — and
 * only then delivered. Delivery is Formspree (proven to reach the inbox), with
 * wp_mail as the fallback if that call fails. The domain has no SPF record,
 * so wp_mail on its own is not something to rely on, and it is not relied on.
 * Whatever happens downstream, the record exists.
 *
 * No nonce, on purpose. Nonces on a form for logged-out visitors break the
 * moment a cache layer serves a page older than the nonce lifetime, and the
 * failure mode is silent. A honeypot, an origin check and a per-IP rate limit
 * are the right amount of friction for a contact form.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

const FPC_LEAD_ACTION = 'fpc_lead';

function fpc_lead_endpoint(): string
{
    return admin_url('admin-post.php');
}

add_action('init', static function (): void {
    register_post_type('fp_lead', [
        'labels' => [
            'name'          => 'Leads',
            'singular_name' => 'Lead',
            'edit_item'     => 'Lead',
            'not_found'     => 'No leads yet',
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => false,
        'exclude_from_search' => true,
        'publicly_queryable'  => false,
        'menu_icon'           => 'dashicons-email-alt',
        'menu_position'       => 25,
        'capability_type'     => 'post',
        'capabilities'        => ['create_posts' => 'do_not_allow'],
        'map_meta_cap'        => true,
        'supports'            => ['title', 'editor'],
    ]);
});

add_action('admin_post_nopriv_' . FPC_LEAD_ACTION, 'fpc_handle_lead');
add_action('admin_post_' . FPC_LEAD_ACTION, 'fpc_handle_lead');

function fpc_handle_lead(): void
{
    $wantsJson = str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json');
    $source    = fpc_lead_field('fp_source') ?: 'contact';

    // Bots fill the hidden field; people cannot see it. Answer as if it
    // worked so nothing is learned from the response.
    if (fpc_lead_field('_gotcha') !== '') {
        fpc_lead_finish($wantsJson, true);
    }

    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '' && wp_parse_url($origin, PHP_URL_HOST) !== wp_parse_url(home_url(), PHP_URL_HOST)) {
        fpc_lead_finish($wantsJson, false, 403);
    }

    $ip  = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    $key = 'fpc_lead_rate_' . md5($ip);
    $n   = (int) get_transient($key);
    if ($n >= 5) {
        fpc_lead_finish($wantsJson, false, 429);
    }
    set_transient($key, $n + 1, HOUR_IN_SECONDS);

    $fields = [
        'name'             => fpc_lead_field('name'),
        'email'            => sanitize_email(fpc_lead_field('email')),
        'business'         => fpc_lead_field('business'),
        'phone'            => fpc_lead_field('phone'),
        'industry'         => fpc_lead_field('industry'),
        'message'          => fpc_lead_field('message', true),
        'scorecard_result' => fpc_lead_field('scorecard_result'),
    ];
    if ($fields['email'] === '' || !is_email($fields['email'])) {
        fpc_lead_finish($wantsJson, false, 400);
    }

    $fields['page'] = wp_get_referer() ? esc_url_raw((string) wp_get_referer()) : '';
    $fields['ip']   = $ip;

    // 1. Record. This is the step that must not fail quietly.
    $title = trim(($fields['name'] ?: $fields['email']) . ($fields['business'] ? ' — ' . $fields['business'] : ''));
    $id    = wp_insert_post([
        'post_type'    => 'fp_lead',
        'post_status'  => 'private',
        'post_title'   => $title !== '' ? $title : 'Lead',
        'post_content' => fpc_lead_body($fields, $source),
        'meta_input'   => ['fpc_source' => $source] + array_filter($fields, static fn($v) => $v !== ''),
    ], true);
    if (is_wp_error($id)) {
        error_log('[frontpaged] lead insert failed: ' . $id->get_error_message());
    }

    // 2. Deliver — Formspree first, wp_mail if that fails.
    $subject = fpc_lead_field('_subject') ?: ($source === 'scorecard' ? 'AI readiness scorecard completed' : 'New inquiry from frontpaged.io');
    if (!fpc_lead_forward_formspree($fields, $subject)) {
        fpc_lead_mail($fields, $subject, $source);
    }

    do_action('fpc_lead_captured', $id, $fields, $source);
    fpc_lead_finish($wantsJson, true);
}

function fpc_lead_forward_formspree(array $fields, string $subject): bool
{
    $endpoint = (string) fpc_option('form_endpoint');
    if ($endpoint === '') {
        return false;
    }
    $payload = array_filter($fields, static fn($v, $k) => $v !== '' && $k !== 'ip', ARRAY_FILTER_USE_BOTH);
    $payload['_subject'] = $subject;

    $res = wp_remote_post($endpoint, [
        'timeout' => 8,
        'headers' => ['Accept' => 'application/json', 'Content-Type' => 'application/json'],
        'body'    => wp_json_encode($payload),
    ]);
    if (is_wp_error($res)) {
        error_log('[frontpaged] formspree: ' . $res->get_error_message());
        return false;
    }
    $code = (int) wp_remote_retrieve_response_code($res);
    if ($code < 200 || $code >= 300) {
        error_log('[frontpaged] formspree HTTP ' . $code . ': ' . substr((string) wp_remote_retrieve_body($res), 0, 200));
        return false;
    }
    return true;
}

function fpc_lead_mail(array $fields, string $subject, string $source): bool
{
    $to      = (string) fpc_option('email');
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    if ($fields['email'] !== '') {
        $headers[] = 'Reply-To: ' . ($fields['name'] !== '' ? $fields['name'] . ' <' . $fields['email'] . '>' : $fields['email']);
    }
    $sent = wp_mail($to, $subject, fpc_lead_body($fields, $source), $headers);
    if (!$sent) {
        error_log('[frontpaged] wp_mail failed for lead from ' . $fields['email']);
    }
    return $sent;
}

function fpc_lead_body(array $fields, string $source): string
{
    $labels = [
        'name' => 'Name', 'email' => 'Email', 'business' => 'Business', 'phone' => 'Phone',
        'industry' => 'Industry', 'scorecard_result' => 'Scorecard', 'message' => 'Message', 'page' => 'From page',
    ];
    $lines = ['Source: ' . $source];
    foreach ($labels as $key => $label) {
        if (($fields[$key] ?? '') !== '') {
            $lines[] = $label . ': ' . $fields[$key];
        }
    }
    return implode("\n", $lines);
}

function fpc_lead_field(string $name, bool $multiline = false): string
{
    // phpcs:ignore WordPress.Security.NonceVerification.Missing -- see file header.
    $raw = isset($_POST[$name]) ? wp_unslash((string) $_POST[$name]) : '';
    $raw = mb_substr($raw, 0, $multiline ? 5000 : 300);
    return $multiline ? trim(sanitize_textarea_field($raw)) : trim(sanitize_text_field($raw));
}

/**
 * A fetch() from the scorecard wants JSON; a plain form post wants to end up
 * on our thank-you page — never on a third party's.
 */
function fpc_lead_finish(bool $json, bool $ok, int $status = 200): never
{
    if ($json) {
        wp_send_json(['ok' => $ok], $ok ? 200 : $status);
    }
    if ($ok) {
        wp_safe_redirect(home_url('/contact/thank-you/'), 303);
    } else {
        wp_safe_redirect(add_query_arg('sent', 'error', home_url('/contact/')), 303);
    }
    exit;
}
