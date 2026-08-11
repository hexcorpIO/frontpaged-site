import { site } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";

// A plain HTML form, deliberately.
//
// This site is a static export with no server, so there is nothing of ours to POST
// to. The browser posts directly to a third-party endpoint and the provider emails
// us the submission. No JavaScript, which means it also works if scripts fail, and
// there is no client bundle cost for a form most visitors never touch.
//
// If site.formEndpoint is empty the form is not rendered at all — a form that POSTs
// nowhere silently loses inquiries, which is worse than not having one. We fall back
// to the email and phone that already work.
export default function ContactForm() {
  const endpoint = site.formEndpoint;

  if (!endpoint) {
    return (
      <div className="rounded-2xl border border-line bg-cream p-8">
        <h3 className="font-serif text-[21px] leading-snug text-navy">
          Send us a note
        </h3>
        <p className="mt-4 text-[16px] leading-[1.75] text-warm-grey">
          Email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-teal underline underline-offset-2"
          >
            {site.email}
          </a>{" "}
          or call{" "}
          <a
            href={site.phoneHref}
            className="text-teal underline underline-offset-2"
          >
            {site.phone}
          </a>
          . Tell us your industry and your market, and we&rsquo;ll reply with whether
          we think we can help before asking you for a call.
        </p>
      </div>
    );
  }

  return (
    <form
      action={endpoint}
      method="POST"
      className="rounded-2xl border border-line bg-white p-8"
    >
      <h3 className="font-serif text-[21px] leading-snug text-navy">
        Send us a note
      </h3>
      <p className="mt-3 text-[15.5px] leading-[1.7] text-warm-grey">
        Not ready to book a call? Tell us what you&rsquo;re working on and
        we&rsquo;ll reply within one business day.
      </p>

      {/* Where the provider sends the visitor after a successful submission.
          Keeping them on our own thank-you page means the conversion is trackable
          and they don't land on a stranger's branded confirmation screen. */}
      <input
        type="hidden"
        name="_redirect"
        value={`${site.url}/contact/thank-you/`}
      />
      <input type="hidden" name="_subject" value="New inquiry from frontpaged.io" />

      {/* Honeypot. Bots fill every field they find; humans never see this one.
          Most providers drop a submission where a field named _gotcha is populated. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="company-website">Do not fill this in</label>
        <input
          id="company-website"
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" autoComplete="name" required />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <Field id="business" label="Business name" autoComplete="organization" />
        <Field id="phone" label="Phone (optional)" type="tel" autoComplete="tel" />
      </div>

      <div className="mt-5">
        <label
          htmlFor="industry"
          className="block text-[14px] font-medium text-navy"
        >
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
        >
          <option value="">Select one</option>
          {getPublishedVerticals().map((v) => (
            <option key={v.slug} value={v.name}>
              {v.name}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="block text-[14px] font-medium text-navy"
        >
          What are you trying to fix?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Your market, what you've tried, and what isn't working."
          className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink placeholder:text-warm-grey/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-teal px-6 py-3.5 text-[16px] font-semibold text-white transition hover:bg-teal/90 sm:w-auto"
      >
        Send message
      </button>

      <p className="mt-4 text-[13.5px] leading-[1.6] text-warm-grey">
        We reply within one business day. Please don&rsquo;t include patient,
        client, or case details — this form isn&rsquo;t a secure channel.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-navy">
        {label}
        {required && <span className="text-teal"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-[16px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
      />
    </div>
  );
}
