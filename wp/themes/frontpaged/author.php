<?php
declare(strict_types=1);
get_header();
$author = get_queried_object();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => $author->display_name]]);
?>
<section class="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal"><?php echo esc_html((string) fpc_option('founder_role')); ?></p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]"><?php echo esc_html($author->display_name); ?></h1>
      <?php if ($bio = fpc_option('founder_bio')) : ?>
        <p class="mt-6 text-[17px] leading-[1.75] text-warm-grey"><?php echo esc_html((string) $bio); ?></p>
      <?php endif; ?>
      <?php if ($li = fpc_option('founder_linkedin')) : ?>
        <p class="mt-4"><a href="<?php echo esc_url((string) $li); ?>" target="_blank" rel="noopener noreferrer" data-track-id="author-linkedin" data-track-type="social" class="text-[15px] font-semibold text-teal-dark hover:text-teal">LinkedIn &rarr;</a></p>
      <?php endif; ?>
    </div>
  </div>
</section>
<section class="py-12">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 class="font-serif text-[26px] text-navy">Articles</h2>
    <ul class="mt-6 divide-y divide-line border-y border-line">
      <?php while (have_posts()) : the_post(); ?>
        <li class="py-5"><a href="<?php the_permalink(); ?>" data-track-id="<?php echo esc_attr('author-post-' . get_post_field('post_name')); ?>" data-track-type="card" class="group block">
          <p class="font-serif text-[19px] text-navy group-hover:text-teal"><?php the_title(); ?></p>
          <p class="mt-1.5 text-[13.5px] text-warm-grey/80"><?php echo esc_html(get_the_date('j F Y')); ?></p>
        </a></li>
      <?php endwhile; ?>
    </ul>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
