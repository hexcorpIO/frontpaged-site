<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Glossary']]);

$terms = get_posts([
    'post_type'      => 'glossary_term',
    'posts_per_page' => -1,
    'orderby'        => 'title',
    'order'          => 'ASC',
]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Glossary</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        Plain definitions for the terms that come up in AI search and SEO work. Each one is written
        to stand alone, because a definition that only makes sense in context is no use to a reader
        skimming — or to an engine quoting it.
      </p>
    </div>
  </div>
</section>

<section class="py-12 sm:py-14">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <dl class="grid gap-5 md:grid-cols-2">
      <?php foreach ($terms as $term) : ?>
        <div id="<?php echo esc_attr($term->post_name); ?>" class="rounded-2xl border border-warm-line bg-white p-6">
          <dt class="font-serif text-[19px] leading-snug text-navy"><?php echo esc_html(get_the_title($term)); ?></dt>
          <?php if ($also = fpc_field('also_known_as', $term->ID)) : ?>
            <p class="mt-1 text-[13px] text-warm-grey/80">Also: <?php echo esc_html((string) $also); ?></p>
          <?php endif; ?>
          <dd class="mt-3 text-[15.5px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) fpc_field('definition', $term->ID)); ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
