<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Blog']]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h1 class="max-w-3xl font-serif text-[40px] font-semibold tracking-tight text-navy sm:text-[48px]">Writing about AI search</h1>
    <p class="mt-6 max-w-3xl text-[17.5px] leading-[1.75] text-warm-grey">
      How AI engines decide who to cite, and what that means for a business that depends on
      being found. Written per industry, not general marketing advice with the nouns swapped.
    </p>
    <ul class="mt-8 flex flex-wrap gap-2.5">
      <?php foreach (get_terms(['taxonomy' => 'post_industry', 'hide_empty' => true]) as $fp_term) : ?>
        <li><a href="<?php echo esc_url(get_term_link($fp_term)); ?>"
               data-track-id="<?php echo esc_attr('blog-filter-' . $fp_term->slug); ?>"
               class="inline-block rounded-full border border-warm-line bg-white px-4 py-2 text-[14px] font-medium text-teal-dark transition hover:border-teal"><?php echo esc_html($fp_term->name); ?></a></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<section class="border-t border-warm-line py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="grid gap-6 md:grid-cols-2">
      <?php while (have_posts()) : the_post(); get_template_part('template-parts/post-card'); endwhile; ?>
    </div>
    <?php
    // Paginated only if the archive ever outgrows one page. The static site
    // listed every published post, and with 21 live that is still the right
    // call — a reader scanning for their industry should not have to page.
    the_posts_pagination(['mid_size' => 2, 'class' => 'mt-10 flex gap-3 text-[15px] font-semibold text-teal-dark']);
    ?>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
