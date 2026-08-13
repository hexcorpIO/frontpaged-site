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
        <a class="text-sm font-semibold text-teal-dark hover:text-teal" href="<?php echo esc_url(home_url('/blog/')); ?>"
           data-track-id="post-back-to-blog">&larr; All articles</a>
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
      <div class="max-w-3xl">
        <?php
        // Collected from the raw content BEFORE rendering, because the table of
        // contents prints above the body it describes. The ids it links to are
        // injected by the same rule on `the_content`, so the two cannot
        // disagree about what a heading's anchor is.
        $fp_headings = fpc_collect_headings(get_the_content());
        if (count($fp_headings) > 2) : ?>
          <nav aria-labelledby="toc-heading" class="my-9 rounded-2xl border border-line bg-cream p-6 sm:p-7">
            <h2 id="toc-heading" class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">On this page</h2>
            <ol class="mt-4 space-y-2.5">
              <?php foreach ($fp_headings as $fp_i => $fp_h) : ?>
                <li class="flex gap-3 text-[15.5px] leading-[1.5]">
                  <span aria-hidden="true" class="tabular-nums text-warm-grey/60"><?php echo esc_html(str_pad((string) ($fp_i + 1), 2, '0', STR_PAD_LEFT)); ?></span>
                  <a href="#<?php echo esc_attr($fp_h['id']); ?>"
                     data-track-id="<?php echo esc_attr('toc-' . $fp_h['id']); ?>" data-track-type="toc"
                     class="text-ink hover:text-teal hover:underline underline-offset-2"><?php echo esc_html($fp_h['text']); ?></a>
                </li>
              <?php endforeach; ?>
            </ol>
          </nav>
        <?php endif; ?>

        <div class="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-a:underline-offset-2 prose-p:text-warm-grey prose-li:text-warm-grey">
          <?php the_content(); ?>
        </div>
      </div>
    </div>
  </section>
</article>

<?php
// Post FAQ and Read next are rendered here rather than through fp_faqs(),
// which is shared with the industry and service pages where a full-bleed
// section is right. On an article both belong inside the text column, as a
// continuation of what the reader is already reading.
$fp_faqs = fpc_faqs($id);
$fp_related = get_posts([
    'post_type'      => 'post',
    'posts_per_page' => 3,
    'post__not_in'   => [$id],
    'tax_query'      => $industry
        ? [['taxonomy' => 'post_industry', 'field' => 'slug', 'terms' => $industry->slug]]
        : [],
]);
?>

<div class="<?php echo esc_attr(fp_container('!max-w-3xl pb-14')); ?>">
  <?php if ($fp_faqs !== []) : ?>
    <section class="mt-12" aria-labelledby="post-faq">
      <h2 id="post-faq" class="font-serif text-2xl font-semibold text-navy">Frequently asked questions</h2>
      <div class="mt-5 space-y-3">
        <?php foreach ($fp_faqs as $fp_faq) : ?>
          <details class="group overflow-hidden rounded-xl border border-warm-line bg-cream">
            <summary class="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-serif text-[17px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
              <?php echo esc_html((string) ($fp_faq['question'] ?? '')); ?>
              <span aria-hidden="true" class="text-2xl font-normal text-teal group-open:hidden">+</span>
              <span aria-hidden="true" class="hidden text-2xl font-normal text-teal group-open:inline">&ndash;</span>
            </summary>
            <p class="px-5 pb-4 text-[15.5px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) ($fp_faq['answer'] ?? '')); ?></p>
          </details>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endif; ?>

  <?php if ($fp_related !== []) : ?>
    <section class="mt-14 border-t border-warm-line pt-10" aria-labelledby="read-next">
      <h2 id="read-next" class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Read next</h2>
      <ul class="mt-5 space-y-4">
        <?php foreach ($fp_related as $fp_post) : ?>
          <li>
            <a class="group block" href="<?php echo esc_url(get_permalink($fp_post)); ?>"
               data-track-id="<?php echo esc_attr('related-post-' . $fp_post->post_name); ?>" data-track-type="card">
              <p class="font-serif text-[19px] leading-snug text-navy group-hover:text-teal"><?php echo esc_html(get_the_title($fp_post)); ?></p>
              <p class="mt-1.5 text-[15px] leading-[1.6] text-warm-grey"><?php echo esc_html(get_the_excerpt($fp_post)); ?></p>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </section>
  <?php endif; ?>
</div>

<?php
fp_cta_panel();
endwhile;
get_footer();
