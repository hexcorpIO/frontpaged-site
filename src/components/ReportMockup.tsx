import Container from "./Container";
import Button from "./Button";
import { CheckIcon, TrendingUpIcon } from "./Icons";

// Monthly citation counts (mock) for the little bar chart — trending up.
const bars = [3, 4, 6, 7, 9, 12];
const maxBar = Math.max(...bars);

const appearances = [
  { label: "ChatGPT", status: "Cited", strong: true },
  { label: "Google AI Overviews", status: "Cited", strong: true },
  { label: "Perplexity", status: "Mentioned", strong: true },
  { label: '"Botox near me" (Google)', status: "#2 ▲", strong: false },
];

export default function ReportMockup() {
  return (
    <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Proof it&rsquo;s working
            </p>
            <h2 className="max-w-md font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              See exactly where you show up — every month.
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-[1.7] text-warm-grey">
              No vanity metrics. Each month you get a plain-English report of where your clinic now
              appears — in Google rankings and in the AI answers patients actually ask. You watch the
              citations climb.
            </p>
            <div className="mt-7">
              <Button href="#contact">See a sample report</Button>
            </div>
          </div>

          {/* Mock report card */}
          <div className="rounded-2xl border border-warm-line bg-white p-6 shadow-[0_24px_60px_rgba(21,38,63,0.12)] sm:p-7">
            <div className="flex items-center justify-between border-b border-warm-line pb-4">
              <div>
                <p className="font-serif text-lg font-semibold text-navy">Visibility report</p>
                <p className="text-[13px] text-warm-grey">Your Med Spa · this month</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[12px] font-semibold text-teal-dark">
                <TrendingUpIcon className="h-4 w-4" /> Trending up
              </span>
            </div>

            {/* Citations bar chart */}
            <div className="mt-5">
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-[13px] font-medium text-navy">AI citations / month</p>
                <p className="font-serif text-2xl font-semibold text-teal">12</p>
              </div>
              <div className="flex h-24 items-end gap-2">
                {bars.map((b, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={`w-full rounded-t ${i === bars.length - 1 ? "bg-teal" : "bg-teal/35"}`}
                      style={{ height: `${(b / maxBar) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Appearances list */}
            <ul className="mt-6 space-y-2.5 border-t border-warm-line pt-5">
              {appearances.map((a) => (
                <li key={a.label} className="flex items-center justify-between text-[14.5px]">
                  <span className="flex items-center gap-2 text-navy">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal/15 text-teal-dark">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    {a.label}
                  </span>
                  <span className={a.strong ? "font-semibold text-teal-dark" : "font-semibold text-gold"}>
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
