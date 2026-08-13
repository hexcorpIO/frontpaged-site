<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Services']]);
?>
<section class="bg-gradient-to-b from-cream to-white pt-14 pb-14 sm:pt-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Services</p>
      <h1 class="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">What we actually do</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        Content and structured data that gets a business named in an AI answer, plus the
        supporting work that makes the rest of it measurable.
      </p>
    </div>
    <div class="mt-12 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
      <?php foreach (fpc_all_services() as $service) : ?>
        <a href="<?php echo esc_url(get_permalink($service)); ?>"
           data-track-id="<?php echo esc_attr('service-card-' . $service->post_name); ?>" data-track-type="card"
           class="group flex flex-col rounded-2xl border border-warm-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-teal">
          <h2 class="font-serif text-[19px] leading-snug text-navy group-hover:text-teal-dark"><?php echo esc_html(get_the_title($service)); ?></h2>
          <p class="mt-2 flex-1 text-[14.5px] leading-[1.6] text-warm-grey"><?php echo esc_html((string) (fpc_field('lead', $service->ID) ?: fpc_field('meta_description', $service->ID))); ?></p>
          <span class="mt-4 text-[14px] font-semibold text-teal-dark">Read more &rarr;</span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php fp_cta_panel(); get_footer();
