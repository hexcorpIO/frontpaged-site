"use client";

import { useState } from "react";
import Link from "next/link";
import {
  questions,
  score,
  MAX_SCORE,
  type Answer,
} from "@/lib/scorecard";
import { site } from "@/lib/site";

// Interactive scorecard. Client-side only — no network call, no data leaves the
// browser unless someone chooses to send it at the end. That is a feature worth
// stating on the page: a tool that silently posts your answers before showing a
// result is a lead form wearing a costume.

const OPTIONS: { value: Answer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "partly", label: "Partly" },
  { value: "no", label: "No / not sure" },
];

export default function Scorecard() {
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const answered = questions.filter((q) => answers[q.id]).length;
  const complete = answered === questions.length;
  const result = score(answers);

  if (submitted) {
    return <Results result={result} onRevise={() => setSubmitted(false)} />;
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-6 border-b border-line bg-cream/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-[14px] text-warm-grey">
          <span>
            {answered} of {questions.length} answered
          </span>
          <span className="tabular-nums">{Math.round((answered / questions.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-teal transition-all duration-300"
            style={{ width: `${(answered / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="mt-8 space-y-8">
        {questions.map((q, i) => (
          <li key={q.id}>
            <fieldset>
              <legend className="font-serif text-[19px] leading-snug text-navy">
                <span className="mr-2 text-teal">{String(i + 1).padStart(2, "0")}</span>
                {q.text}
              </legend>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-warm-grey">{q.help}</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {OPTIONS.map((o) => {
                  const active = answers[q.id] === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`cursor-pointer rounded-full border px-5 py-2 text-[15px] font-medium transition ${
                        active
                          ? "border-teal bg-teal text-white"
                          : "border-line bg-white text-navy hover:border-teal"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={o.value}
                        checked={active}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="mt-10 border-t border-line pt-8">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={answered === 0}
          className="rounded-lg bg-teal px-8 py-3.5 text-[16px] font-semibold text-white transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          See my results
        </button>
        {!complete && answered > 0 && (
          <p className="mt-3 text-[14px] text-warm-grey">
            You can see results now — unanswered questions count as zero, so the
            score will read low until you finish.
          </p>
        )}
      </div>
    </div>
  );
}

function Results({
  result,
  onRevise,
}: {
  result: ReturnType<typeof score>;
  onRevise: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
          Your result
        </p>
        <p className="mt-3 font-serif text-[44px] leading-none text-navy">
          {result.score}
          <span className="text-[24px] text-warm-grey">/{MAX_SCORE}</span>
        </p>
        <p className="mt-3 font-serif text-[24px] leading-snug text-navy">
          {result.band.label}
        </p>
        <p className="mt-3 text-[16.5px] leading-[1.7] text-warm-grey">
          {result.band.summary}
        </p>
      </div>

      <h2 className="mt-12 font-serif text-[26px] leading-tight text-navy">
        Where you stand on each factor
      </h2>
      <ul className="mt-6 space-y-4">
        {result.factors.map((f) => (
          <li key={f.factor.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-[18px] leading-snug text-navy">
                {f.factor.name}
              </h3>
              <span
                className={`text-[14px] font-semibold ${f.weak ? "text-teal-dark" : "text-warm-grey"}`}
              >
                {f.score}/{f.max}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full ${f.weak ? "bg-teal-dark" : "bg-teal"}`}
                style={{ width: `${(f.score / f.max) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-[15px] leading-[1.65] text-warm-grey">{f.factor.why}</p>
            {f.weak && (
              <p className="mt-3 rounded-lg bg-cream px-4 py-3 text-[15px] leading-[1.65] text-ink">
                <strong className="text-navy">What to do: </strong>
                {f.factor.fix}
              </p>
            )}
          </li>
        ))}
      </ul>

      {result.priorities.length > 0 && (
        <div className="mt-10 rounded-2xl border-l-4 border-teal bg-soft p-7">
          <h2 className="font-serif text-[20px] leading-snug text-navy">
            If you only fix one thing
          </h2>
          <p className="mt-3 text-[16px] leading-[1.7] text-warm-grey">
            Start with <strong className="text-navy">{result.priorities[0].factor.name.toLowerCase()}</strong>.
            It scored lowest, and the factors compound — structured data on pages
            with nothing extractable on them does very little.
          </p>
        </div>
      )}

      <EmailResults result={result} />

      {/* The honest handoff. This tool scored self-reported answers; it did not
          query any AI engine. The real check is the thing a human does. */}
      <div className="mt-10 rounded-2xl bg-navy p-8 text-white">
        <h2 className="font-serif text-[24px] leading-snug">
          This scored your setup. It didn&rsquo;t ask ChatGPT about you.
        </h2>
        <p className="mt-3 text-[16.5px] leading-[1.7] text-[#cdd6e2]">
          That&rsquo;s the other thing — the free visibility check, where we put your
          actual questions to ChatGPT, Perplexity and Google and show you what comes
          back, including who gets named instead of you. A person runs it and a
          person walks you through it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact/"
            className="inline-flex items-center rounded-lg bg-teal px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-teal/90"
          >
            Get your free visibility check
          </Link>
          <button
            type="button"
            onClick={onRevise}
            className="inline-flex items-center rounded-lg border border-white/25 px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-white/10"
          >
            Change my answers
          </button>
        </div>
        <p className="mt-5 text-[14px] text-[#9fb6cc]">
          Questions in the meantime:{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Post-reveal capture.
 *
 * Deliberately after the full result, not in front of it. The results above are
 * already complete and stay complete whether or not this is used — the trade
 * offered here is a written plan, not access to something already earned.
 *
 * Submits by fetch rather than a form POST so the visitor keeps their results on
 * screen instead of being navigated to a confirmation page.
 */
function EmailResults({ result }: { result: ReturnType<typeof score> }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!site.formEndpoint) return null;

  const summary = [
    `Score: ${result.score}/${result.max} (${result.percent}%) — ${result.band.label}`,
    "",
    ...result.factors.map((f) => `${f.factor.name}: ${f.score}/${f.max}${f.weak ? "  ← weak" : ""}`),
    "",
    result.priorities.length
      ? `Priority: ${result.priorities[0].factor.name}`
      : "No weak factors.",
  ].join("\n");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-10 rounded-2xl border border-teal bg-soft p-7">
        <h2 className="font-serif text-[20px] leading-snug text-navy">On its way.</h2>
        <p className="mt-3 text-[16px] leading-[1.7] text-warm-grey">
          We&rsquo;ll send the breakdown with a prioritised plan within one business
          day. Your results are still on this page — nothing has changed above.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-line bg-white p-7">
      <h2 className="font-serif text-[20px] leading-snug text-navy">
        Want this as a plan you can act on?
      </h2>
      <p className="mt-3 text-[16px] leading-[1.7] text-warm-grey">
        We&rsquo;ll send your breakdown with the fixes ordered by what would move
        first in your industry. Your results above stay visible either way — this
        is optional.
      </p>

      <input type="hidden" name="_subject" value="AI readiness scorecard completed" />
      <input type="hidden" name="scorecard_result" value={summary} />
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="sc-company">Do not fill this in</label>
        <input id="sc-company" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <label htmlFor="sc-email" className="block text-[14px] font-medium text-navy">
            Email <span className="text-teal">*</span>
          </label>
          <input
            id="sc-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
          />
        </div>
        <div>
          <label htmlFor="sc-business" className="block text-[14px] font-medium text-navy">
            Business name
          </label>
          <input
            id="sc-business"
            name="business"
            type="text"
            autoComplete="organization"
            className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 rounded-lg bg-teal px-7 py-3 text-[16px] font-semibold text-white transition hover:bg-teal/90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send me the plan"}
      </button>

      {status === "error" && (
        <p className="mt-4 text-[15px] text-teal-dark">
          That didn&rsquo;t go through. Email{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>{" "}
          and we&rsquo;ll pick it up from there.
        </p>
      )}

      <p className="mt-4 text-[13.5px] leading-[1.6] text-warm-grey">
        Your answers are only sent if you submit this. They did not leave your
        browser while you were filling the scorecard in.
      </p>
    </form>
  );
}
