<?php
/**
 * Privacy policy.
 *
 * The text is imported from content/pages/privacy.md, so it is edited in git
 * and re-imported — not written in the block editor, where it would drift from
 * what the Next.js source says. No CTA panel: a privacy policy that ends in a
 * sales pitch reads as exactly that.
 */
declare(strict_types=1);
get_header();
while (have_posts()) : the_post();
    fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => get_the_title()]]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">Legal</p>
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]"><?php the_title(); ?></h1>
      <p class="mt-4 text-[14px] text-warm-grey">Last updated <time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time></p>
    </div>
  </div>
</section>
<section class="py-12">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-p:text-warm-grey prose-li:text-warm-grey"><?php the_content(); ?></div>
  </div>
</section>
<?php
endwhile;
get_footer();
