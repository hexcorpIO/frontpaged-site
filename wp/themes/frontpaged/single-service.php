<?php
declare(strict_types=1);
get_header();

while (have_posts()) : the_post();
    $id = get_the_ID();
    fp_breadcrumbs([
        ['name' => 'Home', 'url' => home_url('/')],
        ['name' => 'Services', 'url' => home_url('/services/')],
        ['name' => get_the_title()],
    ]);
?>
<section class="bg-gradient-to-b from-cream to-white pt-14 pb-16 sm:pt-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Service</p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[48px]"><?php the_title(); ?></h1>
      <?php if ($lead = fpc_field('lead', $id)) : ?>
        <p class="mt-6 text-[18px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) $lead); ?></p>
      <?php endif; ?>
      <div class="mt-8 flex flex-wrap gap-3.5">
        <?php echo fp_link(home_url('/contact/'), 'Get a free visibility check', 'service-hero-primary-visibility-check', fp_button_classes('solid', 'lg')); ?>
        <?php echo fp_link(home_url('/pricing/'), 'See pricing', 'service-hero-secondary', fp_button_classes('ghost', 'lg')); ?>
      </div>
      <?php fp_quick_answer($id); ?>
    </div>
  </div>
</section>

<?php $deliverables = fpc_rows('deliverables', $id); if ($deliverables !== []) : ?>
<section class="border-t border-warm-line bg-white py-14" aria-labelledby="deliverables-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="deliverables-heading" class="font-serif text-[26px] text-navy">What you get</h2>
    <ul class="mt-6 grid gap-3 sm:grid-cols-2">
      <?php foreach ($deliverables as $row) : ?>
        <li class="relative rounded-xl border border-warm-line bg-cream py-3.5 pl-11 pr-5 text-[15.5px] text-ink before:absolute before:left-5 before:font-extrabold before:text-teal before:content-['✓']"><?php echo esc_html((string) ($row['value'] ?? '')); ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php $reasons = fpc_rows('reasons', $id); if ($reasons !== []) : ?>
<section class="border-t border-warm-line py-14" aria-labelledby="reasons-heading">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <h2 id="reasons-heading" class="font-serif text-[26px] text-navy">Why it matters</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      <?php foreach ($reasons as $reason) : ?>
        <div class="rounded-2xl border border-line bg-white p-7">
          <h3 class="font-serif text-[19px] leading-snug text-navy"><?php echo esc_html((string) ($reason['heading'] ?? '')); ?></h3>
          <p class="mt-3 text-[15.5px] leading-[1.7] text-warm-grey"><?php echo esc_html((string) ($reason['body'] ?? '')); ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (trim(get_the_content()) !== '') : ?>
<section class="py-12">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-p:text-warm-grey"><?php the_content(); ?></div>
  </div>
</section>
<?php endif;

fp_faqs($id);
fp_cta_panel();
endwhile;
get_footer();
