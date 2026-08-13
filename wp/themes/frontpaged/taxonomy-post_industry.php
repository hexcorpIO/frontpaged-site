<?php
declare(strict_types=1);
get_header();
$fp_term = get_queried_object();
fp_breadcrumbs([
    ['name' => 'Home', 'url' => home_url('/')],
    ['name' => 'Blog', 'url' => home_url('/blog/')],
    ['name' => $fp_term->name],
]);
$fp_industry = get_posts(['post_type' => 'industry', 'name' => $fp_term->slug, 'posts_per_page' => 1]);
$fp_singular = $fp_industry ? (string) fpc_field('name_singular', $fp_industry[0]->ID) : strtolower($fp_term->name);
?>
<section class="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal"><?php echo esc_html($fp_term->name); ?></p>
      <h1 class="mt-3 font-serif text-[40px] font-semibold leading-[1.12] tracking-tight text-navy sm:text-[46px]">SEO and AI-search articles for <?php echo esc_html($fp_singular); ?> owners</h1>
      <p class="mt-6 text-[17px] leading-[1.7] text-warm-grey">
        <?php echo esc_html((string) $fp_term->count); ?> <?php echo $fp_term->count === 1 ? 'article' : 'articles'; ?>
        written for this industry specifically — not general marketing advice with the nouns swapped.
        <?php if ($fp_industry) : ?>
          For what we actually do here, see
          <a href="<?php echo esc_url(get_permalink($fp_industry[0])); ?>" data-track-id="<?php echo esc_attr('blog-industry-services-' . $fp_term->slug); ?>" class="text-teal underline underline-offset-2"><?php echo esc_html(strtolower($fp_term->name)); ?> services</a>.
        <?php endif; ?>
      </p>
    </div>
  </div>
</section>

<section class="border-t border-warm-line py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="grid gap-6 md:grid-cols-2">
      <?php while (have_posts()) : the_post(); get_template_part('template-parts/post-card'); endwhile; ?>
    </div>
    <?php the_posts_pagination(['mid_size' => 2, 'class' => 'mt-10 flex gap-3 text-[15px] font-semibold text-teal-dark']); ?>
    <p class="mt-10 text-[15.5px] text-warm-grey">Browsing a different industry?
      <a href="<?php echo esc_url(home_url('/blog/')); ?>" data-track-id="blog-industry-see-all" class="text-teal underline underline-offset-2">See every article</a>.</p>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
