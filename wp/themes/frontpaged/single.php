<?php
declare(strict_types=1);
get_header();

while (have_posts()) : the_post();
    $id = get_the_ID();
    $terms = get_the_terms($id, 'post_industry');
    $industry = is_array($terms) && $terms !== [] ? $terms[0] : null;

    fp_breadcrumbs(array_values(array_filter([
        ['name' => 'Home', 'url' => home_url('/')],
        ['name' => 'Blog', 'url' => home_url('/blog/')],
        $industry ? ['name' => $industry->name, 'url' => get_term_link($industry)] : null,
        ['name' => get_the_title()],
    ])));
?>
<article>
  <section class="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
    <div class="<?php echo esc_attr(fp_container()); ?>">
      <div class="max-w-3xl">
        <?php if ($industry) : ?>
          <a href="<?php echo esc_url(get_term_link($industry)); ?>" data-track-id="<?php echo esc_attr('post-industry-' . $industry->slug); ?>"
             class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal hover:text-teal-dark"><?php echo esc_html($industry->name); ?></a>
        <?php endif; ?>
        <h1 class="mt-4 font-serif text-[36px] leading-[1.1] text-navy sm:text-[44px]"><?php the_title(); ?></h1>
        <p class="mt-5 text-[14px] text-warm-grey">
          <a href="<?php echo esc_url(get_author_posts_url((int) get_the_author_meta('ID'))); ?>" data-track-id="post-byline-author" class="font-medium text-navy hover:text-teal-dark"><?php the_author(); ?></a>
          <span aria-hidden="true"> · </span>
          <time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date('j F Y')); ?></time>
          <?php if ($updated = fpc_field('updated', $id)) : ?>
            <span aria-hidden="true"> · </span>Updated <time datetime="<?php echo esc_attr((string) $updated); ?>"><?php echo esc_html(date('j F Y', strtotime((string) $updated))); ?></time>
          <?php endif; ?>
        </p>
        <?php fp_quick_answer($id); ?>
      </div>
    </div>
  </section>

  <section class="py-10 sm:py-12">
    <div class="<?php echo esc_attr(fp_container()); ?>">
      <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-a:underline-offset-2 prose-p:text-warm-grey prose-li:text-warm-grey">
        <?php the_content(); ?>
      </div>
    </div>
  </section>
</article>

<?php
fp_faqs($id);

$related = get_posts([
    'post_type' => 'post', 'posts_per_page' => 4, 'post__not_in' => [$id],
    'tax_query' => $industry ? [['taxonomy' => 'post_industry', 'field' => 'slug', 'terms' => $industry->slug]] : [],
]);
if ($related !== []) : ?>
<section class="border-t border-warm-line py-14" aria-labelledby="related-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="related-heading" class="font-serif text-[26px] text-navy">Read next</h2>
    <ul class="mt-8 grid gap-5 sm:grid-cols-2">
      <?php foreach ($related as $post) : ?>
        <li><a href="<?php echo esc_url(get_permalink($post)); ?>" data-track-id="<?php echo esc_attr('related-post-' . $post->post_name); ?>" data-track-type="card"
               class="block h-full rounded-xl border border-warm-line bg-cream p-5 transition hover:border-teal">
          <p class="text-[12px] font-medium uppercase tracking-[0.12em] text-teal-dark"><?php echo esc_html(get_the_date('j F Y', $post)); ?></p>
          <h3 class="mt-2 font-serif text-[18px] leading-snug text-navy"><?php echo esc_html(get_the_title($post)); ?></h3>
        </a></li>
      <?php endforeach; wp_reset_postdata(); ?>
    </ul>
  </div>
</section>
<?php endif;

fp_cta_panel();
endwhile;
get_footer();
