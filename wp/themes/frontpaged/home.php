<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Blog']]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Writing about AI search</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        How AI engines decide who to cite, and what that means for a business that depends on
        being found. Written per industry, not general marketing advice with the nouns swapped.
      </p>
    </div>
    <ul class="mt-10 flex flex-wrap gap-2.5">
      <?php foreach (get_terms(['taxonomy' => 'post_industry', 'hide_empty' => true]) as $term) : ?>
        <li><a href="<?php echo esc_url(get_term_link($term)); ?>" data-track-id="<?php echo esc_attr('blog-filter-' . $term->slug); ?>"
               class="inline-block rounded-full border border-warm-line bg-white px-4 py-2 text-[14px] font-medium text-teal-dark hover:border-teal"><?php echo esc_html($term->name); ?></a></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<section class="py-12 sm:py-14">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <ul class="divide-y divide-line border-y border-line">
      <?php while (have_posts()) : the_post(); ?>
        <li class="py-6">
          <a href="<?php the_permalink(); ?>" data-track-id="<?php echo esc_attr('blog-card-' . get_post_field('post_name')); ?>" data-track-type="card" class="group block">
            <p class="font-serif text-[21px] leading-snug text-navy group-hover:text-teal"><?php the_title(); ?></p>
            <p class="mt-2 text-[15.5px] leading-[1.65] text-warm-grey"><?php echo esc_html(get_the_excerpt()); ?></p>
            <p class="mt-2.5 text-[13.5px] text-warm-grey"><time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date('j F Y')); ?></time></p>
          </a>
        </li>
      <?php endwhile; ?>
    </ul>
    <div class="mt-10 flex justify-between text-[15px] font-semibold text-teal-dark">
      <?php echo get_previous_posts_link('&larr; Newer') ?: '<span></span>'; ?>
      <?php echo get_next_posts_link('Older &rarr;') ?: '<span></span>'; ?>
    </div>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
