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
          Nothing you entered was sent anywhere — the scoring ran in your browser.
          Questions in the meantime:{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>
        </p>
      </div>
    </div>
  );
}
