<?php
declare(strict_types=1);
get_header();
?>
<section class="py-20 sm:py-24">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-2xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Message received</p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Thanks — we&rsquo;ve got it.</h1>
      <p class="mt-6 text-[17px] leading-[1.75] text-warm-grey">
        We reply within one business day, usually sooner. The first reply comes from a person, not
        a sequence, and it will tell you honestly whether we think we can help before it asks you
        for anything.
      </p>
      <div class="mt-8 flex flex-wrap gap-3.5">
        <?php echo fp_link(home_url('/blog/'), 'Read the blog', 'thank-you-blog', fp_button_classes('ghost')); ?>
        <?php echo fp_link(home_url('/ai-readiness-check/'), 'Take the free check', 'thank-you-scorecard', fp_button_classes()); ?>
      </div>
    </div>
  </div>
</section>
<?php get_footer();
