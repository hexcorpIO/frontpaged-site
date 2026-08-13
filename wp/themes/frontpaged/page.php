<?php
declare(strict_types=1);
get_header();
while (have_posts()) : the_post();
    fp_breadcrumbs([['name' => 'Home', 'url' => home_url('/')], ['name' => get_the_title()]]);
?>
<section class="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="max-w-3xl">
      <h1 class="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]"><?php the_title(); ?></h1>
      <?php fp_quick_answer(); ?>
    </div>
  </div>
</section>
<section class="py-12">
  <div class="<?php echo esc_attr(fp_container()); ?>">
    <div class="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-p:text-warm-grey"><?php the_content(); ?></div>
  </div>
</section>
<?php
fp_faqs();
fp_cta_panel();
endwhile;
get_footer();
