<?php declare(strict_types=1); ?>
</main>

<footer class="border-t border-warm-line bg-cream py-14 text-sm text-warm-grey">
  <div class="<?php echo esc_attr(fp_container('flex flex-col gap-10')); ?>">
    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
      <div class="max-w-xs sm:col-span-2 lg:col-span-2">
        <a href="<?php echo esc_url(home_url('/')); ?>" data-track-id="footer-logo-home" class="flex items-center gap-2 text-[18px]">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-teal font-serif text-[15px] font-bold text-white">F</span>
          <span class="font-serif font-semibold text-navy">Frontpaged<span class="text-teal">.io</span></span>
        </a>
        <p class="mt-3 leading-[1.6]">
          SEO &amp; Generative Engine Optimization content for high-ticket local businesses —
          done for you, nationwide.
        </p>
        <div class="mt-4 flex flex-col gap-1.5">
          <a href="<?php echo esc_attr(fpc_option('phone_href')); ?>" data-track-id="footer-phone" class="font-medium text-navy hover:text-teal-dark"><?php echo esc_html((string) fpc_option('phone')); ?></a>
          <a href="mailto:<?php echo esc_attr((string) fpc_option('email')); ?>" data-track-id="footer-email" class="hover:text-teal-dark"><?php echo esc_html((string) fpc_option('email')); ?></a>
          <a href="<?php echo esc_url((string) fpc_option('linkedin')); ?>" target="_blank" rel="noopener noreferrer" data-track-id="footer-social-linkedin" data-track-type="social" class="font-medium hover:text-teal-dark">LinkedIn</a>
        </div>
      </div>

      <div>
        <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy">Industries</p>
        <ul class="space-y-2">
          <?php foreach (fpc_all_industries() as $item) : ?>
            <li><a href="<?php echo esc_url(get_permalink($item)); ?>" data-track-id="<?php echo esc_attr('footer-industries-' . $item->post_name); ?>" class="hover:text-teal-dark"><?php echo esc_html(get_the_title($item)); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div>
        <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy">Services</p>
        <ul class="space-y-2">
          <?php foreach (fpc_all_services() as $item) : ?>
            <li><a href="<?php echo esc_url(get_permalink($item)); ?>" data-track-id="<?php echo esc_attr('footer-services-' . $item->post_name); ?>" class="hover:text-teal-dark"><?php echo esc_html(get_the_title($item)); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div>
        <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy">Company</p>
        <ul class="space-y-2">
          <?php foreach ([
            '/ai-readiness-check/' => 'Free AI readiness check',
            '/about/'             => 'About',
            '/pricing/'           => 'Pricing',
            '/blog/'              => 'Blog',
            '/faq/'               => 'FAQ',
            '/glossary/'          => 'Glossary',
            '/contact/'           => 'Contact',
          ] as $path => $label) : ?>
            <li><a href="<?php echo esc_url(home_url($path)); ?>" data-track-id="<?php echo esc_attr('footer-company-' . sanitize_title($label)); ?>" class="hover:text-teal-dark"><?php echo esc_html($label); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-warm-line pt-6 text-[13px]">
      <span>SEO &amp; Generative Engine Optimization — serving high-ticket local businesses nationwide.</span>
      <span>&copy; <?php echo esc_html(date('Y')); ?> <?php echo esc_html((string) fpc_option('brand_name')); ?>. All rights reserved.</span>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
