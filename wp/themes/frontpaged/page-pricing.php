<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Pricing']]);
$founding = fpc_founding_enabled();
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Pricing</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        Every industry has its own ladder, because the work is not the same in each. This page
        compares them side by side; the industry pages explain what the tiers actually include.
      </p>
      <?php if ($founding) : ?>
        <p class="mt-6 rounded-2xl border-l-4 border-teal bg-soft p-5 text-[15.5px] leading-[1.7] text-ink">
          <strong class="text-navy"><?php echo esc_html((string) fpc_option('founding_headline')); ?>.</strong>
          <?php echo esc_html((string) fpc_option('founding_terms')); ?>
        </p>
      <?php endif; ?>
      <?php if ($guarantee = fpc_option('guarantee')) : ?>
        <p class="mt-5 text-[16px] leading-[1.7] text-warm-grey"><strong class="text-navy">Our guarantee.</strong> <?php echo esc_html((string) $guarantee); ?></p>
      <?php endif; ?>
    </div>
  </div>
</section>

<section class="py-12 sm:py-14">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <?php // Wide table scrolls inside its own container so the page body never
          // scrolls sideways on a phone. ?>
    <div class="overflow-x-auto rounded-2xl border border-warm-line bg-white">
      <table class="w-full min-w-[720px] border-collapse text-left">
        <caption class="sr-only">Monthly pricing by industry and tier</caption>
        <thead>
          <tr class="border-b border-warm-line bg-cream text-[13px] uppercase tracking-[0.1em] text-navy">
            <th scope="col" class="px-5 py-4 font-semibold">Industry</th>
            <?php foreach (['Visibility', 'Authority', 'Domination'] as $label) : ?>
              <th scope="col" class="px-5 py-4 font-semibold"><?php echo esc_html($label); ?></th>
            <?php endforeach; ?>
            <th scope="col" class="px-5 py-4 font-semibold">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach (fpc_all_industries() as $industry) :
            $tiers = fpc_industry_tiers($industry->ID); ?>
            <tr class="border-b border-line last:border-0">
              <th scope="row" class="px-5 py-4 align-top">
                <a href="<?php echo esc_url(get_permalink($industry)); ?>" data-track-id="<?php echo esc_attr('pricing-table-' . $industry->post_name); ?>" class="font-serif text-[17px] text-navy hover:text-teal-dark"><?php echo esc_html(get_the_title($industry)); ?></a>
              </th>
              <?php foreach ($tiers as $tier) :
                $list = (int) ($tier['price'] ?? 0); ?>
                <td class="px-5 py-4 align-top tabular-nums">
                  <span class="font-semibold text-navy"><?php echo esc_html(fpc_usd(fpc_effective_price($list))); ?></span><span class="text-[13px] text-warm-grey">/mo</span>
                  <?php if ($founding) : ?><br><s class="text-[13px] text-warm-grey"><?php echo esc_html(fpc_usd($list)); ?></s><?php endif; ?>
                </td>
              <?php endforeach; ?>
              <td class="px-5 py-4 align-top text-[14px] text-warm-grey">
                <?php $ent = (int) fpc_field('enterprise_from', $industry->ID);
                echo $ent ? esc_html('from ' . fpc_usd($ent) . '/mo') : '—'; ?>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <p class="mt-6 text-[14.5px] leading-[1.7] text-warm-grey">
      Enterprise is a sales-led band rather than a card — multi-location groups are scoped per
      market, so a fixed number would be a guess. All prices are monthly; annual prepay is ten
      months for twelve.
    </p>

    <div class="mt-10 grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-warm-line bg-white p-7">
        <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">Not ready for a plan?</p>
        <p class="mt-2 font-serif text-[19px] font-semibold text-navy">AI Visibility Audit — $500</p>
        <p class="mt-2 text-[14.5px] leading-[1.6] text-warm-grey">A one-off audit of where you stand across ChatGPT, Perplexity and Google, credited in full toward month one if you go ahead.</p>
        <?php echo fp_link(home_url('/contact/'), 'Book the audit', 'pricing-summary-paid-audit', 'mt-4 w-full ' . fp_button_classes('ghost')); ?>
      </div>
      <div class="rounded-2xl border border-warm-line bg-white p-7">
        <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">Not sure which industry?</p>
        <p class="mt-2 font-serif text-[19px] font-semibold text-navy">Start with your category</p>
        <p class="mt-2 text-[14.5px] leading-[1.6] text-warm-grey">Prices mean very little until you know which sources and rules apply to you. The industry pages answer that first.</p>
        <?php echo fp_link(home_url('/industries/'), 'See pricing for your industry', 'pricing-summary-see-industry-pricing', 'mt-4 w-full ' . fp_button_classes()); ?>
      </div>
    </div>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
