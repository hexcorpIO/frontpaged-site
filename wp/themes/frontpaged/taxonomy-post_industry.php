<?php
declare(strict_types=1);
get_header();
$term = get_queried_object();
fp_breadcrumbs([
    ['name' => 'Home', 'url' => home_url('/')],
    ['name' => 'Blog', 'url' => home_url('/blog/')],
    ['name' => $term->name],
]);
$industry = get_posts(['post_type' => 'industry', 'name' => $term->slug, 'posts_per_page' => 1]);
$singular = $industry ? (string) fpc_field('name_singular', $industry[0]->ID) : strtolower($term->name);
?>
<section class="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal"><?php echo esc_html($term->name); ?></p>
      <h1 class="mt-3 font-serif text-[38px] leading-[1.1] text-navy sm:text-[46px]">SEO and AI-search articles for <?php echo esc_html($singular); ?> owners</h1>
      <p class="mt-6 text-[17px] leading-[1.7] text-warm-grey">
        <?php echo esc_html((string) $term->count); ?> <?php echo $term->count === 1 ? 'article' : 'articles'; ?>
        written for this industry specifically — not general marketing advice with the nouns swapped.
        <?php if ($industry) : ?>
          For what we actually do here, see
          <a href="<?php echo esc_url(get_permalink($industry[0])); ?>" data-track-id="<?php echo esc_attr('blog-industry-services-' . $term->slug); ?>" class="text-teal underline underline-offset-2"><?php echo esc_html(strtolower($term->name)); ?> services</a>.
        <?php endif; ?>
      </p>
    </div>
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
    <p class="mt-10 text-[15.5px] text-warm-grey">Browsing a different industry?
      <a href="<?php echo esc_url(home_url('/blog/')); ?>" data-track-id="blog-industry-see-all" class="text-teal underline underline-offset-2">See every article</a>.</p>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
