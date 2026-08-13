<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'FAQ']]);

// Grouped by industry, from the same rows each industry page renders and emits
// as schema. Nothing is authored twice, so an answer cannot be right in one
// place and stale in the other.
$groups = [];
foreach (fpc_all_industries() as $industry) {
    $faqs = fpc_faqs($industry->ID);
    if ($faqs !== []) {
        $groups[] = ['title' => get_the_title($industry), 'url' => get_permalink($industry), 'faqs' => $faqs];
    }
}
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Questions, answered</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        Everything buyers actually ask, grouped by industry. Each answer also appears on the
        industry page it belongs to — this page is the index, not a second copy.
      </p>
    </div>
  </div>
</section>

<section class="py-12 sm:py-14">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <?php foreach ($groups as $group) : ?>
      <div class="mb-12">
        <h2 class="font-serif text-[24px] text-navy">
          <a href="<?php echo esc_url($group['url']); ?>" data-track-id="<?php echo esc_attr('faq-hub-' . sanitize_title($group['title'])); ?>" class="hover:text-teal-dark"><?php echo esc_html($group['title']); ?></a>
        </h2>
        <div class="mt-5 divide-y divide-line border-y border-line">
          <?php foreach ($group['faqs'] as $faq) : ?>
            <details class="group py-5">
              <summary class="cursor-pointer list-none font-serif text-[17.5px] text-navy marker:content-none"><?php echo esc_html((string) ($faq['question'] ?? '')); ?></summary>
              <p class="mt-3 text-[16px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) ($faq['answer'] ?? '')); ?></p>
            </details>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
