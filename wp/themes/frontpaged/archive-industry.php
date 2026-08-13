<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Industries']]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Industries</p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Who we do this for</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        The sources an AI engine trusts for a plastic surgeon are not the ones it trusts for a
        personal injury firm. Pick your category and the plans, the sources and the compliance
        rules are the ones that actually apply to you.
      </p>
    </div>

    <div class="mt-12 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
      <?php foreach (fpc_all_industries() as $industry) :
        $range = fpc_industry_price_range($industry->ID); ?>
        <a href="<?php echo esc_url(get_permalink($industry)); ?>"
           data-track-id="<?php echo esc_attr('industry-card-' . $industry->post_name); ?>" data-track-type="card"
           class="group flex flex-col rounded-2xl border border-warm-line bg-white p-6 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-teal">
          <h2 class="font-serif text-[18px] font-semibold leading-snug text-navy group-hover:text-teal-dark"><?php echo esc_html(get_the_title($industry)); ?></h2>
          <p class="mt-2 flex-1 text-[14px] leading-[1.6] text-warm-grey"><?php echo esc_html((string) fpc_field('hero_tagline', $industry->ID)); ?></p>
          <?php if ($range) : ?>
            <p class="mt-4 text-[13px] font-semibold text-teal-dark">
              From <?php echo esc_html(fpc_usd($range['min'])); ?>/mo<?php echo fpc_founding_enabled() ? ', founding rate' : ''; ?>
            </p>
          <?php endif; ?>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
