<?php
declare(strict_types=1);
get_header();
?>
<section class="bg-gradient-to-b from-cream to-white pt-16 pb-20 sm:pt-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">SEO + Generative Engine Optimization</p>
        <h1 class="mt-4 font-serif text-[42px] leading-[1.05] text-navy sm:text-[56px]">Be the first name AI recommends.</h1>
        <p class="mt-6 max-w-xl text-[19px] leading-[1.7] text-warm-grey">
          Whether you run a med spa, a dermatology practice, a personal injury firm, or a real
          estate team, your next client is asking Google or ChatGPT before they ever find your
          website. We build the content and structured data that gets your business named in that
          answer — done-for-you, engineered to rank on Google and get cited by AI search.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3.5">
          <?php echo fp_link(home_url('/contact/'), 'Get your free visibility check', 'hero-primary-visibility-check', fp_button_classes('solid', 'lg')); ?>
          <?php echo fp_link(home_url('/industries/'), 'See plans', 'hero-secondary-see-plans', fp_button_classes('ghost', 'lg')); ?>
        </div>
        <p class="mt-3.5 text-sm text-warm-grey">No commitment — just your report.</p>
      </div>

      <div class="rounded-2xl border border-warm-line bg-white p-6 shadow-[0_24px_60px_rgba(21,38,63,0.10)]">
        <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">The AI answer, after Frontpaged</p>
        <ol class="space-y-2 text-[15px] text-navy">
          <li class="font-semibold">1. Your Business</li>
          <li class="text-warm-grey">2. [Competitor A]</li>
          <li class="text-warm-grey">3. [Competitor B]</li>
        </ol>
        <p class="mt-3 text-[12px] font-medium text-teal-dark">Cited by ChatGPT · Perplexity · Google AI Overviews</p>
      </div>
    </div>
  </div>
</section>

<?php // The mechanism. Question-headed and answer-first — the exact content shape we sell. ?>
<section id="how-ai-decides" class="border-t border-warm-line bg-white py-16 sm:py-24" aria-labelledby="how-ai-decides-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">The mechanism</p>
      <h2 id="how-ai-decides-heading" class="mt-4 font-serif text-[32px] leading-[1.12] text-navy sm:text-[40px]">How AI decides who to recommend</h2>
      <p class="mt-6 text-[18px] leading-[1.7] text-warm-grey">
        When someone asks an AI assistant for a recommendation, it is not ranking links — it is
        assembling an answer from sources it can read and corroborate, then naming a handful of
        businesses. Which names appear comes down to five things, and all five are buildable.
      </p>
    </div>

    <ol class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <?php
      $factors = [
        ['01', 'It needs a sentence it can lift', 'A model composing an answer is looking for a passage that answers the question on its own, without the surrounding page. A treatment page that opens with three paragraphs about your philosophy has nothing liftable at the top.'],
        ['02', 'It reads your markup, not your design', 'Structured data states your facts in a form a machine cannot misread. A beautiful site with no structured data is legible to visitors and close to invisible to the systems deciding who gets named.'],
        ['03', 'It checks whether other sources agree', 'Models corroborate. Your site, your Google profile, the directories in your field, your reviews — when those agree, confidence goes up and you get named specifically.'],
        ['04', 'The sources differ by industry', 'The third parties a model leans on for a plastic surgeon are not the ones it leans on for a personal injury firm. Knowing which ones matter in your category is most of the work.'],
        ['05', 'It rewards the page that is actually specific', 'Generic explanations already exist everywhere, so a model can synthesize them without citing anyone. The page that gets cited holds something the model cannot assemble from elsewhere.'],
      ];
      foreach ($factors as [$n, $heading, $body]) : ?>
        <li class="rounded-2xl border border-line bg-cream p-7">
          <span class="font-serif text-[22px] text-teal"><?php echo esc_html($n); ?></span>
          <h3 class="mt-3 font-serif text-[19px] leading-snug text-navy"><?php echo esc_html($heading); ?></h3>
          <p class="mt-3 text-[15.5px] leading-[1.7] text-warm-grey"><?php echo esc_html($body); ?></p>
        </li>
      <?php endforeach; ?>
    </ol>

    <div class="mt-12 flex flex-col gap-5 rounded-2xl border-2 border-teal bg-soft p-7 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-serif text-[21px] leading-snug text-navy">Score yourself against these five, free</p>
        <p class="mt-2 max-w-xl text-[15.5px] leading-[1.65] text-warm-grey">Ten questions, about two minutes, results on screen immediately. No email required to see them.</p>
      </div>
      <?php echo fp_link(home_url('/ai-readiness-check/'), 'Take the check', 'how-ai-decides-scorecard-cta', 'shrink-0 ' . fp_button_classes()); ?>
    </div>
  </div>
</section>

<?php // Industry chooser — the segment question, asked before any price is shown. ?>
<section class="border-t border-warm-line py-16 sm:py-20" aria-labelledby="industries-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="industries-heading" class="font-serif text-[30px] leading-tight text-navy sm:text-[36px]">Built for your category, not for everyone</h2>
    <p class="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">Pick yours and the plans, the sources and the compliance rules are the ones that actually apply.</p>
    <div class="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
      <?php foreach (fpc_all_industries() as $industry) :
        $range = fpc_industry_price_range($industry->ID); ?>
        <a href="<?php echo esc_url(get_permalink($industry)); ?>"
           data-track-id="<?php echo esc_attr('industry-card-' . $industry->post_name); ?>" data-track-type="card"
           class="group flex flex-col rounded-2xl border border-warm-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-teal">
          <h3 class="font-serif text-[18px] font-semibold leading-snug text-navy group-hover:text-teal-dark"><?php echo esc_html(get_the_title($industry)); ?></h3>
          <p class="mt-2 flex-1 text-[14px] leading-[1.6] text-warm-grey"><?php echo esc_html((string) fpc_field('hero_tagline', $industry->ID)); ?></p>
          <?php if ($range) : ?><p class="mt-4 text-[13px] font-semibold text-teal-dark">From <?php echo esc_html(fpc_usd($range['min'])); ?>/mo</p><?php endif; ?>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php
// A page's own Gutenberg content, if the editor has added any.
while (have_posts()) : the_post();
    if (trim(get_the_content()) !== '') : ?>
      <section class="border-t border-warm-line py-14">
        <div class="<?php echo esc_attr(fp_container()); ?>">
          <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-p:text-warm-grey"><?php the_content(); ?></div>
        </div>
      </section>
    <?php endif;
endwhile;

fp_cta_panel();
get_footer();
