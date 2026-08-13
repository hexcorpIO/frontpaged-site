<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'AI Readiness Check']]);

$config = fpc_scorecard_config();
wp_enqueue_script('fp-scorecard', get_theme_file_uri('assets/js/scorecard.js'), [], (string) filemtime(get_theme_file_path('assets/js/scorecard.js')), true);
wp_add_inline_script('fp-scorecard', 'window.fpScorecard=' . wp_json_encode($config) . ';', 'before');
?>
<section class="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
  <div class="<?php echo esc_attr(fp_container('!max-w-3xl')); ?>">
    <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
      Free · <?php echo count($config['questions']); ?> questions · <?php echo count($config['factors']); ?> factors
    </p>
    <h1 class="mt-4 font-serif text-[38px] leading-[1.1] text-navy sm:text-[46px]">Is your business legible to AI search?</h1>
    <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
      Answer <?php echo count($config['questions']); ?> questions about your own setup and get an instant score
      against the five factors that decide whether an AI assistant names you — plus what to fix first.
    </p>
    <?php // Said up front, not in the small print. ?>
    <p class="mt-6 rounded-2xl border-l-4 border-teal bg-soft p-5 text-[15.5px] leading-[1.7] text-ink">
      <strong class="text-navy">What this is and isn&rsquo;t.</strong> This scores what you tell it,
      in your browser. Your answers stay there unless you choose to email yourself the plan at the end.
      It does <em>not</em> query ChatGPT or Perplexity about you — that&rsquo;s the
      <a href="<?php echo esc_url(home_url('/contact/')); ?>" data-track-id="scorecard-intro-visibility-check" class="text-teal underline underline-offset-2">free visibility check</a>,
      which a person runs. Both are free; they answer different questions.
    </p>
  </div>
</section>

<section class="pb-16 sm:pb-20">
  <div class="<?php echo esc_attr(fp_container('!max-w-3xl')); ?>">
    <div id="fp-scorecard">
      <?php // No-JS fallback. The tool is interactive by nature, so rather than
            // pretend otherwise it points at the thing a person actually runs. ?>
      <noscript>
        <div class="rounded-2xl border border-line bg-white p-7">
          <p class="font-serif text-[20px] text-navy">This check needs JavaScript</p>
          <p class="mt-3 text-[16px] leading-[1.7] text-warm-grey">
            It scores your answers in your browser, which is why nothing is transmitted while you
            fill it in. If you would rather a person did it,
            <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="text-teal underline underline-offset-2">ask for the free visibility check</a>
            and we will run the real thing against ChatGPT and Perplexity.
          </p>
        </div>
      </noscript>
    </div>
  </div>
</section>

<?php
$faqs = [
  ['Does this actually check ChatGPT for my business?', 'No, and it says so throughout. This scores what you tell it about your own setup against the five factors that determine citability. Querying ChatGPT, Perplexity and Google for real is the free visibility check, which a person runs and walks you through.'],
  ['Where do the answers go?', 'Nowhere, unless you ask us to send you the plan at the end. The scoring runs entirely in your browser and your answers are not transmitted while you work through the questions. Like most sites, this page loads analytics that records the visit itself; it cannot see what you selected.'],
  ['What are the five factors based on?', 'How AI assistants actually assemble a recommendation: whether your page holds a liftable answer, whether your markup states your facts, whether independent sources corroborate them, whether you are present in the sources that matter in your category, and whether your content is specific enough to be worth citing.'],
  ['What if I don\'t know the answer to a question?', 'Choose "No / not sure". For most of these, not knowing is functionally the same as no — if nobody has ever mentioned schema markup to you, it is almost certainly absent.'],
  ['How long does it take?', 'Two or three minutes. Ten questions, three options each, and the result appears immediately with a per-factor breakdown and what to do about the weakest one.'],
];
?>
<section class="border-t border-warm-line bg-soft py-14" aria-labelledby="faq-heading">
  <div class="<?php echo esc_attr(fp_container('!max-w-3xl')); ?>">
    <h2 id="faq-heading" class="font-serif text-[26px] leading-tight text-navy">Questions about this tool</h2>
    <div class="mt-6 divide-y divide-line border-y border-line">
      <?php foreach ($faqs as [$q, $a]) : ?>
        <details class="group py-5">
          <summary class="cursor-pointer list-none font-serif text-[17.5px] text-navy marker:content-none"><?php echo esc_html($q); ?></summary>
          <p class="mt-3 text-[16px] leading-[1.7] text-warm-grey"><?php echo esc_html($a); ?></p>
        </details>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php get_footer();
