<?php
/**
 * One blog card. Matches the static site's markup: date, reading time, title as
 * an H2, description, tag pills, read-more.
 *
 * The title is an <h2> and not a styled <p>. On an index the titles ARE the
 * document outline — a screen reader user navigating by heading needs them, and
 * so does anything parsing the page for structure.
 */

declare(strict_types=1);
$fp_tags = get_the_terms(get_the_ID(), 'post_tag');
?>
<article class="flex flex-col rounded-2xl border border-warm-line bg-white p-7 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-teal hover:shadow-[0_16px_44px_rgba(21,38,63,0.10)]">
  <div class="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-warm-grey">
    <time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date('F j, Y')); ?></time>
    <span aria-hidden="true">·</span>
    <span><?php echo esc_html((string) fpc_reading_time()); ?> min read</span>
  </div>

  <h2 class="font-serif text-[21px] font-semibold text-navy">
    <a class="hover:text-teal-dark" href="<?php the_permalink(); ?>"
       data-track-id="<?php echo esc_attr('blog-card-' . get_post_field('post_name')); ?>" data-track-type="card"><?php the_title(); ?></a>
  </h2>

  <p class="mt-2 flex-1 text-[15px] leading-[1.6] text-warm-grey"><?php echo esc_html(get_the_excerpt()); ?></p>

  <?php if (is_array($fp_tags) && $fp_tags !== []) : ?>
    <div class="mt-4 flex flex-wrap gap-2">
      <?php foreach (array_slice($fp_tags, 0, 4) as $fp_tag) : ?>
        <span class="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-teal-dark"><?php echo esc_html($fp_tag->name); ?></span>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>

  <a class="mt-5 text-[15px] font-semibold text-teal-dark hover:text-teal" href="<?php the_permalink(); ?>"
     data-track-id="<?php echo esc_attr('blog-readmore-' . get_post_field('post_name')); ?>" data-track-type="card">Read more &rarr;</a>
</article>
