<?php declare(strict_types=1); get_header(); ?>
<section class="py-24">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-2xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">404</p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">That page isn&rsquo;t here.</h1>
      <p class="mt-6 text-[17px] leading-[1.75] text-warm-grey">
        It may have moved, or the link may be wrong. The industry pages and the blog are the two
        places most people are looking for.
      </p>
      <div class="mt-8 flex flex-wrap gap-3.5">
        <?php echo fp_link(home_url('/industries/'), 'See industries', '404-industries', fp_button_classes()); ?>
        <?php echo fp_link(home_url('/blog/'), 'Read the blog', '404-blog', fp_button_classes('ghost')); ?>
      </div>
    </div>
  </div>
</section>
<?php get_footer();
