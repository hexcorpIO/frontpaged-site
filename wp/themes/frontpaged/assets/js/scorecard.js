/**
 * AI readiness check.
 *
 * Scores in the browser. Nothing is transmitted while someone answers — that is
 * a claim the page makes in three places, so it has to be true: there is no
 * fetch here except the one a visitor triggers by asking for the plan.
 *
 * Analytics is categorical only. The score BUCKET and a count of questions
 * answered are pushed; which weaknesses a business admitted to are not. That is
 * a deliberate line: per-answer data tied to an email address is a different and
 * much harder thing to defend on a page making privacy claims.
 */
(function () {
  "use strict";

  var root = document.getElementById("fp-scorecard");
  if (!root || !window.fpScorecard) return;

  var config = window.fpScorecard;
  var questions = config.questions;
  var answers = {};
  var started = false;
  var halfwayFired = false;
  var lastBucket = "";
  var HALFWAY = Math.ceil(questions.length / 2);

  function push(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  function industry() {
    return window.__fp_industry || "none";
  }

  function answeredCount() {
    return Object.keys(answers).length;
  }

  function scoreAll() {
    var byFactor = {};
    config.factors.forEach(function (f) {
      byFactor[f.id] = { factor: f, score: 0, max: 0 };
    });

    questions.forEach(function (q) {
      var bucket = byFactor[q.factor];
      if (!bucket) return;
      bucket.max += 2;
      bucket.score += config.points[answers[q.id]] || 0;
    });

    var factors = Object.keys(byFactor).map(function (k) {
      var f = byFactor[k];
      f.weak = f.score <= f.max / 2;
      return f;
    });

    var total = factors.reduce(function (n, f) { return n + f.score; }, 0);
    var percent = Math.round((total / config.max) * 100);
    var band = config.bands.find(function (b) { return percent >= b.min; }) ||
               config.bands[config.bands.length - 1];

    return { score: total, percent: percent, band: band, factors: factors };
  }

  function onAnswer(questionId, value) {
    var wasAnswered = Boolean(answers[questionId]);
    // Count what this answer brings the total TO. Questions can be answered in
    // any order and changed afterwards, so keying off a question index would
    // re-fire check_start whenever someone revised question one, and miss the
    // halfway mark entirely for anyone who answered out of order.
    var next = wasAnswered ? answeredCount() : answeredCount() + 1;
    answers[questionId] = value;

    if (!started && next === 1) {
      started = true;
      push({ event: "check_start", check: { industry: industry() } });
    } else if (!halfwayFired && !wasAnswered && next === HALFWAY) {
      halfwayFired = true;
      push({ event: "check_progress", check: { questions_answered: next, industry: industry() } });
    }

    renderProgress();
  }

  function renderProgress() {
    var n = answeredCount();
    var pct = Math.round((n / questions.length) * 100);
    root.querySelector("[data-count]").textContent = n + " of " + questions.length + " answered";
    root.querySelector("[data-percent]").textContent = pct + "%";
    root.querySelector("[data-bar]").style.width = pct + "%";
    root.querySelector("[data-submit]").disabled = n === 0;
    var partial = root.querySelector("[data-partial]");
    partial.hidden = n === 0 || n === questions.length;
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function showResults() {
    var result = scoreAll();
    lastBucket = result.band.bucket;

    push({
      event: "check_complete",
      // score_bucket sits at the top level and questions_answered stays nested
      // because that is how the GTM container declares them.
      score_bucket: result.band.bucket,
      check: { questions_answered: answeredCount(), industry: industry() }
    });

    var html =
      '<div class="rounded-2xl border border-line bg-white p-8">' +
        '<p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Your result</p>' +
        '<p class="mt-3 font-serif text-[44px] leading-none text-navy">' + result.score +
          '<span class="text-[24px] text-warm-grey">/' + config.max + '</span></p>' +
        '<p class="mt-3 font-serif text-[24px] leading-snug text-navy">' + esc(result.band.label) + '</p>' +
        '<p class="mt-3 text-[16.5px] leading-[1.7] text-warm-grey">' + esc(result.band.summary) + '</p>' +
      '</div>' +
      '<h2 class="mt-12 font-serif text-[26px] leading-tight text-navy">Where you stand on each factor</h2>' +
      '<ul class="mt-6 space-y-4">' +
        result.factors.map(function (f) {
          return '<li class="rounded-2xl border border-line bg-white p-6">' +
            '<div class="flex flex-wrap items-baseline justify-between gap-2">' +
              '<h3 class="font-serif text-[18px] leading-snug text-navy">' + esc(f.factor.name) + '</h3>' +
              '<span class="text-[14px] font-semibold ' + (f.weak ? "text-teal-dark" : "text-warm-grey") + '">' + f.score + '/' + f.max + '</span>' +
            '</div>' +
            '<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><div class="h-full rounded-full ' +
              (f.weak ? "bg-teal-dark" : "bg-teal") + '" style="width:' + (f.max ? (f.score / f.max) * 100 : 0) + '%"></div></div>' +
            '<p class="mt-3 text-[15px] leading-[1.65] text-warm-grey">' + esc(f.factor.why) + '</p>' +
            (f.weak ? '<p class="mt-3 rounded-lg bg-cream px-4 py-3 text-[15px] leading-[1.65] text-ink"><strong class="text-navy">What to do: </strong>' + esc(f.factor.fix) + '</p>' : '') +
          '</li>';
        }).join("") +
      '</ul>' +
      emailFormHtml() +
      '<div class="mt-10 rounded-2xl bg-navy p-8 text-white">' +
        '<h2 class="font-serif text-[24px] leading-snug">This scored your setup. It didn&rsquo;t ask ChatGPT about you.</h2>' +
        '<p class="mt-3 text-[16.5px] leading-[1.7] text-[#cdd6e2]">That&rsquo;s the other thing — the free visibility check, where we put your actual questions to ChatGPT, Perplexity and Google and show you what comes back, including who gets named instead of you.</p>' +
        '<div class="mt-6 flex flex-wrap gap-3">' +
          '<a href="/contact/" data-track-id="scorecard-results-visibility-check" data-track-type="cta" data-result-cta class="inline-flex items-center rounded-lg bg-teal px-6 py-3 text-[16px] font-semibold text-white hover:bg-teal/90">Get your free visibility check</a>' +
          '<button type="button" data-revise data-track-id="scorecard-change-answers" class="inline-flex items-center rounded-lg border border-white/25 px-6 py-3 text-[16px] font-semibold text-white hover:bg-white/10">Change my answers</button>' +
        '</div>' +
      '</div>';

    root.innerHTML = html;
    root.scrollIntoView({ behavior: "smooth", block: "start" });
    wireResults();
  }

  function emailFormHtml() {
    if (!config.endpoint) return "";
    return '<form data-email-form class="mt-10 rounded-2xl border border-line bg-white p-7">' +
      '<h2 class="font-serif text-[20px] leading-snug text-navy">Want this as a plan you can act on?</h2>' +
      '<p class="mt-3 text-[16px] leading-[1.7] text-warm-grey">We&rsquo;ll send your breakdown with the fixes ordered by what would move first in your industry. Your results above stay visible either way — this is optional.</p>' +
      '<div class="mt-5 grid gap-4 sm:grid-cols-[1.2fr_1fr]">' +
        '<div><label for="sc-email" class="block text-[14px] font-medium text-navy">Email <span class="text-teal">*</span></label>' +
        '<input id="sc-email" name="email" type="email" required autocomplete="email" class="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"></div>' +
        '<div><label for="sc-business" class="block text-[14px] font-medium text-navy">Business name</label>' +
        '<input id="sc-business" name="business" type="text" autocomplete="organization" class="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"></div>' +
      '</div>' +
      '<div aria-hidden="true" style="position:absolute;left:-9999px"><label for="sc-gotcha">Do not fill this in</label><input id="sc-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>' +
      '<button type="submit" data-track-id="scorecard-send-plan" data-track-type="cta" class="mt-5 rounded-lg bg-teal px-7 py-3 text-[16px] font-semibold text-white hover:bg-teal/90">Send me the plan</button>' +
      '<p class="mt-4 text-[13.5px] leading-[1.6] text-warm-grey" data-form-note>Your answers are only sent if you submit this. They did not leave your browser while you were filling the scorecard in.</p>' +
    '</form>';
  }

  function wireResults() {
    var revise = root.querySelector("[data-revise]");
    if (revise) revise.addEventListener("click", render);

    var cta = root.querySelector("[data-result-cta]");
    if (cta) {
      cta.addEventListener("click", function () {
        // The delegated listener already reports this as a click; the explicit
        // push exists to carry the bucket, which a generic click cannot know.
        push({ event: "result_cta_click", score_bucket: lastBucket, cta_location: "results" });
      });
    }

    var form = root.querySelector("[data-email-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      var body = new FormData(form);
      var result = scoreAll();
      body.append("_subject", "AI readiness scorecard completed");
      body.append("scorecard_result", "Score: " + result.score + "/" + config.max + " (" + result.percent + "%) — " + result.band.label);

      fetch(config.endpoint, { method: "POST", headers: { Accept: "application/json" }, body: body })
        .then(function (res) {
          if (res.ok) {
            push({
              event: "check_email_share",
              score_bucket: lastBucket,
              check: { questions_answered: answeredCount(), industry: industry() }
            });
            form.innerHTML = '<h2 class="font-serif text-[20px] text-navy">On its way.</h2>' +
              '<p class="mt-3 text-[16px] leading-[1.7] text-warm-grey">We&rsquo;ll send the breakdown with a prioritised plan within one business day. Your results are still on this page.</p>';
          } else {
            push({ event: "form_error", form_name: "check_email_share" });
            note.innerHTML = 'That didn&rsquo;t go through. Email <a class="underline" href="mailto:' + config.email + '">' + config.email + '</a> and we&rsquo;ll pick it up from there.';
          }
        })
        .catch(function () {
          push({ event: "form_error", form_name: "check_email_share" });
          note.innerHTML = 'That didn&rsquo;t go through. Email <a class="underline" href="mailto:' + config.email + '">' + config.email + '</a>.';
        });
    });
  }

  function render() {
    var html =
      '<div class="sticky top-[66px] z-10 -mx-6 border-b border-line bg-cream/95 px-6 py-3 backdrop-blur">' +
        '<div class="flex items-center justify-between text-[14px] text-warm-grey">' +
          '<span data-count>0 of ' + questions.length + ' answered</span><span class="tabular-nums" data-percent>0%</span>' +
        '</div>' +
        '<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div class="h-full rounded-full bg-teal transition-all duration-300" data-bar style="width:0%"></div></div>' +
      '</div>' +
      '<ol class="mt-8 space-y-8">' +
        questions.map(function (q, i) {
          return '<li><fieldset>' +
            '<legend class="font-serif text-[19px] leading-snug text-navy">' +
              '<span class="mr-2 text-teal">' + String(i + 1).padStart(2, "0") + '</span>' + esc(q.text) +
            '</legend>' +
            '<p class="mt-2 text-[14.5px] leading-[1.6] text-warm-grey">' + esc(q.help) + '</p>' +
            '<div class="mt-4 flex flex-wrap gap-2.5">' +
              [["yes", "Yes"], ["partly", "Partly"], ["no", "No / not sure"]].map(function (o) {
                return '<label class="cursor-pointer rounded-full border border-line bg-white px-5 py-2 text-[15px] font-medium text-navy transition hover:border-teal has-[:checked]:border-teal has-[:checked]:bg-teal has-[:checked]:text-white">' +
                  '<input type="radio" name="' + esc(q.id) + '" value="' + o[0] + '" class="sr-only">' + o[1] + '</label>';
              }).join("") +
            '</div></fieldset></li>';
        }).join("") +
      '</ol>' +
      '<div class="mt-10 border-t border-line pt-8">' +
        '<button type="button" data-submit disabled data-track-id="scorecard-see-results" data-track-type="cta" class="rounded-lg bg-teal px-8 py-3.5 text-[16px] font-semibold text-white transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-40">See my results</button>' +
        '<p class="mt-3 text-[14px] text-warm-grey" data-partial hidden>You can see results now — unanswered questions count as zero, so the score will read low until you finish.</p>' +
      '</div>';

    root.innerHTML = html;
    root.addEventListener("change", function (e) {
      if (e.target.type === "radio") onAnswer(e.target.name, e.target.value);
    });
    root.querySelector("[data-submit]").addEventListener("click", showResults);
    renderProgress();
  }

  render();
})();
