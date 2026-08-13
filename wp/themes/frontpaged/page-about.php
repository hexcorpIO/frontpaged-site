<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'About']]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">About Frontpaged</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey"><?php echo esc_html((string) fpc_option('description')); ?></p>
    </div>
  </div>
</section>

<?php // The Person node lives at this URL, so the visible page has to state the
      // same facts the schema does. A credential asserted only in markup is a
      // credential nobody can check. ?>
<section class="py-12" aria-labelledby="founder-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl rounded-2xl border border-warm-line bg-white p-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal"><?php echo esc_html((string) fpc_option('founder_role')); ?></p>
      <h2 id="founder-heading" class="mt-3 font-serif text-[28px] text-navy"><?php echo esc_html((string) fpc_option('founder_name')); ?></h2>
      <?php if ($bio = fpc_option('founder_bio')) : ?>
        <p class="mt-4 text-[16.5px] leading-[1.75] text-warm-grey"><?php echo esc_html((string) $bio); ?></p>
      <?php endif; ?>

      <?php $credentials = fpc_option_rows('credentials'); if ($credentials !== []) : ?>
        <ul class="mt-5 flex flex-wrap gap-2">
          <?php foreach ($credentials as $credential) : ?>
            <li class="rounded-full border border-warm-line bg-cream px-3.5 py-1.5 text-[13.5px] font-medium text-teal-dark"><?php echo esc_html($credential); ?></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>

      <div class="mt-6 flex flex-wrap gap-4 text-[15px]">
        <?php if ($li = fpc_option('founder_linkedin')) : ?>
          <a href="<?php echo esc_url((string) $li); ?>" target="_blank" rel="noopener noreferrer" data-track-id="about-founder-linkedin" data-track-type="social" class="font-semibold text-teal-dark hover:text-teal">LinkedIn &rarr;</a>
        <?php endif; ?>
        <a href="<?php echo esc_url(home_url('/author/benton-purvis/')); ?>" data-track-id="about-author-archive" class="font-semibold text-teal-dark hover:text-teal">Articles &rarr;</a>
      </div>
    </div>
  </div>
</section>

<?php
while (have_posts()) : the_post();
  if (trim(get_the_content()) !== '') : ?>
    <section class="pb-12">
      <div class="<?php echo esc_attr(fp_container()); ?>">
        <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-p:text-warm-grey"><?php the_content(); ?></div>
      </div>
    </section>
  <?php endif;
endwhile;

fp_cta_panel();
get_footer();
