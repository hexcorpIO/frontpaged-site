<?php
declare(strict_types=1);
get_header();

while (have_posts()) :
    the_post();
    $id       = get_the_ID();
    $singular = (string) (fpc_field('name_singular', $id) ?: get_the_title());
    $tiers    = fpc_industry_tiers($id);
    $founding = fpc_founding_enabled();

    fp_breadcrumbs([
        ['name' => 'Home', 'url' => home_url('/')],
        ['name' => 'Industries', 'url' => home_url('/industries/')],
        ['name' => get_the_title()],
    ]);
?>

<section class="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">SEO &amp; GEO for <?php echo esc_html(get_the_title()); ?></p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[48px]"><?php the_title(); ?></h1>
      <p class="mt-6 text-[18px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) fpc_field('hero_tagline', $id)); ?></p>
      <div class="mt-8 flex flex-wrap gap-3.5">
        <?php echo fp_link(home_url('/contact/'), 'Get your free visibility check', 'industry-hero-primary', fp_button_classes('solid', 'lg')); ?>
        <?php echo fp_link('#pricing', 'See plans', 'industry-hero-pricing', fp_button_classes('ghost', 'lg')); ?>
      </div>
      <?php fp_quick_answer($id); ?>
    </div>
  </div>
</section>

<?php if (trim(get_the_content()) !== '') : ?>
<section class="py-12 sm:py-14">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-a:underline-offset-2 prose-p:text-warm-grey">
      <?php the_content(); ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($tiers !== []) : ?>
<section id="pricing" class="border-t border-warm-line bg-white py-16 sm:py-20" aria-labelledby="pricing-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="pricing-heading" class="font-serif text-[28px] leading-tight text-navy sm:text-[34px]">
      Plans for <?php echo esc_html(strtolower(get_the_title())); ?>
    </h2>
    <?php if ($founding) : ?>
      <p class="mt-3 text-[15px] font-medium text-teal-dark">
        <?php echo esc_html((string) fpc_option('founding_headline')); ?> — first
        <?php echo esc_html((string) fpc_option('founding_slots')); ?> clients in this industry.
      </p>
    <?php endif; ?>

    <div class="mt-10 grid gap-6 lg:grid-cols-3">
      <?php foreach ($tiers as $tier) :
        $list      = (int) ($tier['price'] ?? 0);
        $effective = fpc_effective_price($list);
        $featured  = !empty($tier['featured']);
        $features  = (array) ($tier['features'] ?? []);
      ?>
        <article class="flex flex-col rounded-2xl border bg-white p-7 <?php echo $featured ? 'border-teal shadow-[0_16px_44px_rgba(21,38,63,0.10)]' : 'border-warm-line'; ?>">
          <?php if ($featured) : ?>
            <p class="mb-3 inline-flex self-start rounded-full bg-teal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Most popular</p>
          <?php endif; ?>
          <h3 class="font-serif text-[22px] text-navy"><?php echo esc_html((string) ($tier['name'] ?? '')); ?></h3>
          <p class="mt-3 font-serif text-[36px] leading-none text-navy">
            <?php echo esc_html(fpc_usd($effective)); ?><span class="text-[16px] text-warm-grey">/mo</span>
          </p>
          <?php if ($founding) : ?>
            <p class="mt-2 text-[13.5px] font-medium text-teal-dark">
              <s class="text-warm-grey"><?php echo esc_html(fpc_usd($list)); ?></s> · founding rate, locked 12 months
            </p>
          <?php else : ?>
            <p class="mt-2 text-[13.5px] font-medium text-warm-grey">
              <?php echo esc_html(fpc_usd(fpc_annual_price($list))); ?>/yr if prepaid — 2 months free
            </p>
          <?php endif; ?>
          <p class="mb-4 mt-2 min-h-10 text-[14px] text-warm-grey"><?php echo esc_html((string) ($tier['for'] ?? '')); ?></p>
          <ul class="mb-6 flex-1">
            <?php foreach ($features as $feature) :
              $text = is_array($feature) ? (string) reset($feature) : (string) $feature; ?>
              <li class="relative border-b border-warm-line py-[7px] pl-[26px] text-[15px] text-ink before:absolute before:left-0 before:font-extrabold before:text-teal before:content-['✓']"><?php echo esc_html($text); ?></li>
            <?php endforeach; ?>
          </ul>
          <?php echo fp_link(
              home_url('/contact/'),
              (string) ($tier['cta'] ?? 'Get started'),
              'pricing-tier-' . get_post_field('post_name', $id) . '-' . sanitize_title((string) ($tier['name'] ?? '')),
              'w-full ' . fp_button_classes($featured ? 'solid' : 'ghost')
          ); ?>
        </article>
      <?php endforeach; ?>
    </div>

    <?php if ($enterprise = (int) fpc_field('enterprise_from', $id)) : ?>
      <p class="mt-8 rounded-2xl border border-warm-line bg-cream p-6 text-[15.5px] leading-[1.7] text-warm-grey">
        <strong class="text-navy">Multi-location groups.</strong>
        Enterprise engagements start at <?php echo esc_html(fpc_usd($enterprise)); ?>/mo and are scoped per market.
        <?php echo fp_link(home_url('/contact/'), 'Talk to us', 'industry-enterprise-contact', 'text-teal underline underline-offset-2', 'inline'); ?>.
      </p>
    <?php endif; ?>
  </div>
</section>
<?php endif; ?>

<?php
$sources = fpc_rows('citation_sources', $id);
if ($sources !== []) : ?>
<section class="border-t border-warm-line py-14 sm:py-16" aria-labelledby="sources-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="sources-heading" class="font-serif text-[26px] leading-tight text-navy">Where AI engines look in this category</h2>
    <p class="mt-3 max-w-[760px] text-[16px] leading-[1.7] text-warm-grey">
      When an engine answers a question from <?php echo esc_html((string) (fpc_field('audience_noun', $id) ?: 'buyers')); ?>
      in this category, these are the third-party sources it leans on most. We align what they say
      about your <?php echo esc_html((string) (fpc_field('client_noun', $id) ?: 'business')); ?> with what your own site says.
    </p>
    <ul class="mt-6 flex flex-wrap gap-2.5">
      <?php foreach ($sources as $source) : ?>
        <li><a href="<?php echo esc_url((string) ($source['url'] ?? '')); ?>" rel="nofollow noopener"
               data-track-id="<?php echo esc_attr('citation-source-' . sanitize_title((string) ($source['label'] ?? ''))); ?>" data-track-type="citation"
               class="inline-block rounded-full border border-warm-line bg-cream px-4 py-2 text-[14px] font-medium text-teal-dark transition hover:border-teal"><?php echo esc_html((string) ($source['label'] ?? '')); ?></a></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php
$note = fpc_field('compliance_note', $id);
$compliance_sources = fpc_rows('compliance_sources', $id);
if ($note || $compliance_sources !== []) : ?>
<section class="border-t border-warm-line bg-soft py-14" aria-labelledby="compliance-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="compliance-heading" class="font-serif text-[22px] text-navy">What we will and will not claim</h2>
    <?php if ($note) : ?><p class="mt-3 max-w-[760px] text-[16px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) $note); ?></p><?php endif; ?>
    <?php $wont = fpc_rows('compliance_we_will_not', $id); if ($wont !== []) : ?>
      <ul class="mt-5 space-y-2">
        <?php foreach ($wont as $row) : ?>
          <li class="text-[15px] leading-[1.6] text-warm-grey">— <?php echo esc_html((string) ($row['value'] ?? '')); ?></li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
    <?php if ($compliance_sources !== []) : ?>
      <h3 class="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-teal-dark">Sources</h3>
      <ul class="mt-3 space-y-2">
        <?php foreach ($compliance_sources as $source) : ?>
          <li class="text-[14.5px] leading-[1.6] text-warm-grey">
            <a href="<?php echo esc_url((string) ($source['url'] ?? '')); ?>" rel="nofollow noopener"
               data-track-id="<?php echo esc_attr('compliance-source-' . sanitize_title((string) ($source['label'] ?? ''))); ?>" data-track-type="citation"
               class="font-medium text-teal-dark underline-offset-2 hover:underline"><?php echo esc_html((string) ($source['label'] ?? '')); ?></a>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
    <?php $disclaimers = fpc_rows('compliance_required_disclaimers', $id); if ($disclaimers !== []) : ?>
      <div class="mt-6 space-y-1.5 border-t border-warm-line pt-5">
        <?php foreach ($disclaimers as $row) : ?>
          <p class="text-[13px] leading-[1.6] text-warm-grey"><?php echo esc_html((string) ($row['value'] ?? '')); ?></p>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</section>
<?php endif; ?>

<?php
fp_faqs($id, 'Questions ' . strtolower((string) (fpc_field('audience_noun', $id) ?: 'buyers')) . ' ask');

// Related articles from the matching blog taxonomy term.
$related = get_posts([
    'post_type'      => 'post',
    'posts_per_page' => 4,
    'tax_query'      => [[ 'taxonomy' => 'post_industry', 'field' => 'slug', 'terms' => get_post_field('post_name', $id) ]],
]);
if ($related !== []) : ?>
<section class="border-t border-warm-line py-14" aria-labelledby="related-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="related-heading" class="font-serif text-[26px] text-navy">Written for <?php echo esc_html($singular); ?> owners</h2>
    <ul class="mt-8 grid gap-5 sm:grid-cols-2">
      <?php foreach ($related as $post) : setup_postdata($post); ?>
        <li>
          <a href="<?php echo esc_url(get_permalink($post)); ?>"
             data-track-id="<?php echo esc_attr('related-post-' . $post->post_name); ?>" data-track-type="card"
             class="block h-full rounded-xl border border-warm-line bg-cream p-5 transition hover:border-teal">
            <p class="text-[12px] font-medium uppercase tracking-[0.12em] text-teal-dark"><?php echo esc_html(get_the_date('j F Y', $post)); ?></p>
            <h3 class="mt-2 font-serif text-[18px] leading-snug text-navy"><?php echo esc_html(get_the_title($post)); ?></h3>
            <p class="mt-2 text-[14.5px] leading-[1.6] text-warm-grey"><?php echo esc_html(get_the_excerpt($post)); ?></p>
          </a>
        </li>
      <?php endforeach; wp_reset_postdata(); ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php
fp_cta_panel();
endwhile;
get_footer();
