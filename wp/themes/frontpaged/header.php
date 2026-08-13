<?php declare(strict_types=1); ?>
<!doctype html>
<html <?php language_attributes(); ?> class="h-full antialiased">
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class('flex min-h-full flex-col font-sans'); ?>>
<?php wp_body_open(); ?>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

<?php
// Site-wide cross-promo. nofollow so it does not pass link equity off every page.
$banner_url = 'https://tageasy.io';
?>
<div class="bg-navy text-white">
  <div class="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-6 py-2 text-center text-[13px]">
    <span class="text-[#cdd6e2]">Need tagging &amp; analytics done right?</span>
    <a href="<?php echo esc_url($banner_url); ?>" target="_blank" rel="noopener noreferrer nofollow"
       data-track-id="top-banner-tageasy" data-track-type="cta"
       class="font-semibold text-white underline decoration-teal decoration-2 underline-offset-2 hover:text-teal">Meet TagEasy &rarr;</a>
  </div>
</div>

<header class="sticky top-0 z-20 border-b border-warm-line bg-cream/85 backdrop-blur-md">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <nav class="flex h-[66px] items-center justify-between" aria-label="Primary">
      <a href="<?php echo esc_url(home_url('/')); ?>" data-track-id="header-logo-home" class="flex items-center gap-2 text-[22px]">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal font-serif text-[17px] font-bold text-white">F</span>
        <span class="font-serif font-semibold text-navy">Frontpaged<span class="text-teal">.io</span></span>
        <span class="sr-only">Frontpaged home</span>
      </a>

      <div class="hidden items-center gap-7 lg:flex">
        <?php
        // Dropdowns are CSS-only: hover and focus-within, no JavaScript. A menu
        // that needs JS is a menu that is closed to a crawler.
        $menus = [
          'Industries' => fpc_all_industries(),
          'Services'   => fpc_all_services(),
        ];
        foreach ($menus as $label => $items) : ?>
          <div class="group relative">
            <button class="inline-flex items-center gap-1 text-[15px] font-medium text-navy/80 hover:text-teal-dark">
              <?php echo esc_html($label); ?>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" class="mt-0.5"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <ul class="min-w-[240px] rounded-xl border border-warm-line bg-white p-2 shadow-[0_16px_44px_rgba(21,38,63,0.12)]">
                <?php foreach ($items as $item) : ?>
                  <li><a href="<?php echo esc_url(get_permalink($item)); ?>"
                         data-track-id="<?php echo esc_attr('header-dropdown-' . strtolower($label) . '-' . $item->post_name); ?>"
                         class="block rounded-lg px-3 py-2 text-[15px] text-navy hover:bg-soft hover:text-teal-dark"><?php echo esc_html(get_the_title($item)); ?></a></li>
                <?php endforeach; ?>
                <li><a href="<?php echo esc_url(home_url('/' . strtolower($label) . '/')); ?>"
                       data-track-id="<?php echo esc_attr('header-dropdown-' . strtolower($label) . '-all'); ?>"
                       class="block rounded-lg px-3 py-2 text-[15px] font-medium text-teal-dark hover:bg-soft">All <?php echo esc_html(strtolower($label)); ?></a></li>
              </ul>
            </div>
          </div>
        <?php endforeach; ?>

        <a href="<?php echo esc_url(home_url('/ai-readiness-check/')); ?>" data-track-id="header-free-check" class="text-[15px] font-medium text-teal-dark hover:text-teal">Free check</a>
        <a href="<?php echo esc_url(home_url('/pricing/')); ?>" data-track-id="header-pricing" class="text-[15px] font-medium text-navy/80 hover:text-teal-dark">Pricing</a>
        <a href="<?php echo esc_url(home_url('/blog/')); ?>" data-track-id="header-blog" class="text-[15px] font-medium text-navy/80 hover:text-teal-dark">Blog</a>
        <a href="<?php echo esc_url(home_url('/faq/')); ?>" data-track-id="header-faq" class="text-[15px] font-medium text-navy/80 hover:text-teal-dark">FAQ</a>
        <?php echo fp_link(home_url('/contact/'), 'Free visibility check', 'header-cta-visibility-check', 'rounded-full bg-teal px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-teal-dark'); ?>
      </div>

      <?php // Mobile menu uses <details>, so it opens without JavaScript. ?>
      <details class="lg:hidden [&_svg.close]:hidden [&[open]_svg.open]:hidden [&[open]_svg.close]:block">
        <summary data-track-id="header-mobile-menu" data-track-type="control" class="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-navy marker:content-none hover:bg-soft" aria-label="Menu">
          <svg class="open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
          <svg class="close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </summary>
        <div class="absolute left-0 right-0 border-t border-warm-line bg-cream">
          <div class="<?php echo esc_attr(fp_container('flex flex-col gap-4 py-5')); ?>">
            <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">Industries</p>
            <?php foreach (fpc_all_industries() as $item) : ?>
              <a href="<?php echo esc_url(get_permalink($item)); ?>" data-track-id="<?php echo esc_attr('mobile-industry-' . $item->post_name); ?>" class="text-[15px] text-navy hover:text-teal-dark"><?php echo esc_html(get_the_title($item)); ?></a>
            <?php endforeach; ?>
            <p class="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">Services</p>
            <?php foreach (fpc_all_services() as $item) : ?>
              <a href="<?php echo esc_url(get_permalink($item)); ?>" data-track-id="<?php echo esc_attr('mobile-service-' . $item->post_name); ?>" class="text-[15px] text-navy hover:text-teal-dark"><?php echo esc_html(get_the_title($item)); ?></a>
            <?php endforeach; ?>
            <div class="mt-2 flex flex-col gap-1.5">
              <a href="<?php echo esc_url(home_url('/ai-readiness-check/')); ?>" data-track-id="mobile-free-check" class="text-[15px] font-medium text-teal-dark">Free check</a>
              <a href="<?php echo esc_url(home_url('/pricing/')); ?>" data-track-id="mobile-pricing" class="text-[15px] font-medium text-navy">Pricing</a>
              <a href="<?php echo esc_url(home_url('/blog/')); ?>" data-track-id="mobile-blog" class="text-[15px] font-medium text-navy">Blog</a>
              <a href="<?php echo esc_url(home_url('/faq/')); ?>" data-track-id="mobile-faq" class="text-[15px] font-medium text-navy">FAQ</a>
              <a href="<?php echo esc_url(home_url('/about/')); ?>" data-track-id="mobile-about" class="text-[15px] font-medium text-navy">About</a>
            </div>
            <?php echo fp_link(home_url('/contact/'), 'Free visibility check', 'mobile-cta-visibility-check', 'w-full ' . fp_button_classes()); ?>
          </div>
        </div>
      </details>
    </nav>
  </div>
</header>

<main id="main">
