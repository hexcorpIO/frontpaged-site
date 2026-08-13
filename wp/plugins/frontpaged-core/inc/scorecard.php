<?php
/**
 * The AI readiness check.
 *
 * Scores what a visitor tells us about their own setup against the five factors
 * that decide citability. It queries no AI engine, and the page says so in three
 * places — a tool that implied otherwise would undercut the one argument the
 * whole site rests on.
 *
 * Scoring runs in the browser so nothing is transmitted while someone answers.
 * This file is the server half: it holds the questions, and the band and bucket
 * definitions that the browser and the analytics both read, so there is exactly
 * one definition of what a score means.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/** @return array{questions: array<int, array<string,string>>, factors: array<int, array<string,string>>} */
function fpc_scorecard(): array
{
    static $data = null;
    if ($data !== null) {
        return $data;
    }

    $raw = get_option('fpc_scorecard');
    $decoded = $raw ? json_decode((string) $raw, true) : null;

    return $data = [
        'questions' => $decoded['questions'] ?? [],
        'factors'   => $decoded['factors'] ?? [],
    ];
}

function fpc_scorecard_max(): int
{
    return count(fpc_scorecard()['questions']) * 2;
}

/**
 * Bands, and the analytics bucket that belongs to each.
 *
 * The bucket is a property OF the band rather than a second set of thresholds
 * beside it. A separate fpBucket() with its own cutoffs was the obvious way to
 * write this and it is wrong: the two drift the first time either changes, and
 * the symptom is a GA4 row reading "strong" for someone the page told
 * "Partly ready". One table, no possible disagreement.
 *
 * The bottom two bands share a bucket because "significant gaps" and "not yet
 * legible" are the same sales conversation.
 *
 * @return array<int, array{min:int, bucket:string, label:string, summary:string}>
 */
function fpc_scorecard_bands(): array
{
    return [
        [
            'min'     => 80,
            'bucket'  => 'strong',
            'label'   => 'Well positioned',
            'summary' => 'The foundations are in place. At this level the gap between you and a citation is usually depth and consistency over time rather than anything structural — which is a much better problem to have than the alternative.',
        ],
        [
            'min'     => 55,
            'bucket'  => 'some-gaps',
            'label'   => 'Partly ready',
            'summary' => 'Some of the machinery is there and some of it is missing, which typically shows up as being findable for your own name and invisible for everything else. The weakest factors below are where the return is.',
        ],
        [
            'min'     => 30,
            'bucket'  => 'at-risk',
            'label'   => 'Significant gaps',
            'summary' => 'Enough is missing that AI assistants likely have no confident basis for naming you, even where you deserve to be named. None of it is exotic to fix — it is mostly work nobody has been assigned.',
        ],
        [
            'min'     => 0,
            'bucket'  => 'at-risk',
            'label'   => 'Not yet legible',
            'summary' => 'As things stand there is little for an assistant to read, corroborate or quote. That sounds worse than it is: almost everything on this list is fixable, and starting from here means the early gains are the largest.',
        ],
    ];
}

/** Everything the browser needs, in one payload. */
function fpc_scorecard_config(): array
{
    $data = fpc_scorecard();

    return [
        'questions' => array_map(
            static fn(array $q): array => [
                'id'     => (string) ($q['id'] ?? ''),
                'factor' => (string) ($q['factor'] ?? ''),
                'text'   => (string) ($q['text'] ?? ''),
                'help'   => (string) ($q['help'] ?? ''),
            ],
            $data['questions']
        ),
        'factors' => array_map(
            static fn(array $f): array => [
                'id'   => (string) ($f['id'] ?? ''),
                'name' => (string) ($f['name'] ?? ''),
                'why'  => (string) ($f['why'] ?? ''),
                'fix'  => (string) ($f['fix'] ?? ''),
            ],
            $data['factors']
        ),
        'bands'    => fpc_scorecard_bands(),
        'max'      => fpc_scorecard_max(),
        // Unanswered questions score zero rather than being excluded, so a
        // half-finished scorecard cannot report an inflated result.
        'points'   => ['yes' => 2, 'partly' => 1, 'no' => 0],
        'endpoint' => (string) fpc_option('form_endpoint'),
        'email'    => (string) fpc_option('email'),
    ];
}
