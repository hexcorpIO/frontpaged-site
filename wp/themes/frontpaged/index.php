<?php
/**
 * Fallback template.
 *
 * WordPress requires this file to exist before it will let a theme be activated
 * at all, and it is what renders for any query no more specific template
 * matches. Every route the site actually publishes has its own template, so
 * reaching this file means something unanticipated was requested — a search, or
 * a taxonomy nobody registered a template for. It renders a plain list rather
 * than pretending to be a designed page.
 */

declare(strict_types=1);
get_header();
?>
<section class="py-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h1 class="font-serif text-[34px] leading-tight text-navy"><?php echo esc_html(wp_get_document_title()); ?></h1>
    <?php if (have_posts()) : ?>
      <ul class="mt-8 divide-y divide-line border-y border-line">
        <?php while (have_posts()) : the_post(); ?>
          <li class="py-5">
            <a href="<?php the_permalink(); ?>" data-track-id="<?php echo esc_attr('index-' . get_post_field('post_name')); ?>" data-track-type="card" class="group block">
              <p class="font-serif text-[19px] text-navy group-hover:text-teal"><?php the_title(); ?></p>
              <p class="mt-1.5 text-[15px] leading-[1.6] text-warm-grey"><?php echo esc_html(get_the_excerpt()); ?></p>
            </a>
          </li>
        <?php endwhile; ?>
      </ul>
    <?php else : ?>
      <p class="mt-6 text-[17px] text-warm-grey">Nothing here.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_footer();
