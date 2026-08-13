<?php
declare(strict_types=1);
get_header();
fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => 'Contact']]);
$endpoint = (string) fpc_option('form_endpoint');
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">Get your free visibility check</h1>
      <p class="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
        We put your actual questions to ChatGPT, Perplexity and Google, show you what comes back —
        including who gets named instead of you — and walk you through the three fastest fixes.
        No pitch required.
      </p>
    </div>
  </div>
</section>

<section class="pb-16">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 class="font-serif text-[24px] text-navy">Book a 30-minute slot</h2>
        <div class="mt-5 overflow-hidden rounded-2xl bg-white p-3 shadow-[0_24px_60px_rgba(21,38,63,0.10)]">
          <?php // The widget is mounted by tracking.js, which rebuilds the URL with
                // whatever attribution is stored so the booking record carries it. ?>
          <div data-calendly-url="<?php echo esc_url((string) fpc_option('calendly')); ?>" style="min-width:320px;height:700px"></div>
          <noscript>
            <p class="p-6 text-[15.5px] leading-[1.7] text-warm-grey">
              The scheduler needs JavaScript. Email
              <a href="mailto:<?php echo esc_attr((string) fpc_option('email')); ?>" class="text-teal underline">
                <?php echo esc_html((string) fpc_option('email')); ?></a> and we&rsquo;ll find a time.
            </p>
          </noscript>
        </div>
      </div>

      <div>
        <?php if ($endpoint) : ?>
          <?php // A plain HTML POST. No server of our own, and it works without
                // JavaScript — a form that silently loses an inquiry is worse
                // than no form. ?>
          <form action="<?php echo esc_url($endpoint); ?>" method="POST" class="rounded-2xl border border-line bg-white p-8">
            <h2 class="font-serif text-[21px] leading-snug text-navy">Send us a note</h2>
            <p class="mt-3 text-[15.5px] leading-[1.7] text-warm-grey">Not ready to book a call? Tell us what you&rsquo;re working on and we&rsquo;ll reply within one business day.</p>

            <?php // Formspree's redirect field is _next. _redirect is Basin's name
                  // for it and is silently ignored, which sends people to a
                  // stranger's confirmation page instead of ours. ?>
            <input type="hidden" name="_next" value="<?php echo esc_url(home_url('/contact/thank-you/')); ?>">
            <input type="hidden" name="_subject" value="New inquiry from frontpaged.io">
            <div aria-hidden="true" style="position:absolute;left:-9999px">
              <label for="company-website">Do not fill this in</label>
              <input id="company-website" type="text" name="_gotcha" tabindex="-1" autocomplete="off">
            </div>

            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              <?php foreach ([['name','Your name','text','name',true],['email','Email','email','email',true],['business','Business name','text','organization',false],['phone','Phone (optional)','tel','tel',false]] as [$id,$label,$type,$auto,$req]) : ?>
                <div>
                  <label for="<?php echo esc_attr($id); ?>" class="block text-[14px] font-medium text-navy"><?php echo esc_html($label); ?><?php echo $req ? ' <span class="text-teal">*</span>' : ''; ?></label>
                  <input id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($id); ?>" type="<?php echo esc_attr($type); ?>" autocomplete="<?php echo esc_attr($auto); ?>" <?php echo $req ? 'required' : ''; ?> class="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25">
                </div>
              <?php endforeach; ?>
            </div>

            <div class="mt-5">
              <label for="industry" class="block text-[14px] font-medium text-navy">Industry</label>
              <select id="industry" name="industry" class="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25">
                <option value="">Select one</option>
                <?php foreach (fpc_all_industries() as $industry) : ?>
                  <option value="<?php echo esc_attr(get_the_title($industry)); ?>"><?php echo esc_html(get_the_title($industry)); ?></option>
                <?php endforeach; ?>
                <option value="Other">Something else</option>
              </select>
            </div>

            <div class="mt-5">
              <label for="message" class="block text-[14px] font-medium text-navy">What are you trying to fix?</label>
              <textarea id="message" name="message" rows="5" required placeholder="Your market, what you've tried, and what isn't working." class="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink placeholder:text-warm-grey/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"></textarea>
            </div>

            <button type="submit" data-track-id="contact-form-submit" data-track-type="cta" class="mt-6 w-full rounded-lg bg-teal px-6 py-3.5 text-[16px] font-semibold text-white transition hover:bg-teal/90 sm:w-auto">Send message</button>
            <p class="mt-4 text-[13.5px] leading-[1.6] text-warm-grey">We reply within one business day. Please don&rsquo;t include patient, client, or case details — this form isn&rsquo;t a secure channel.</p>
          </form>
        <?php else : ?>
          <div class="rounded-2xl border border-line bg-cream p-8">
            <h2 class="font-serif text-[21px] leading-snug text-navy">Send us a note</h2>
            <p class="mt-4 text-[16px] leading-[1.75] text-warm-grey">
              Email <a href="mailto:<?php echo esc_attr((string) fpc_option('email')); ?>" data-track-id="contact-fallback-email" class="text-teal underline underline-offset-2"><?php echo esc_html((string) fpc_option('email')); ?></a>
              or call <a href="<?php echo esc_attr((string) fpc_option('phone_href')); ?>" data-track-id="contact-fallback-phone" class="text-teal underline underline-offset-2"><?php echo esc_html((string) fpc_option('phone')); ?></a>.
            </p>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
<?php get_footer();
