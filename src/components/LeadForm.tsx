"use client";

import { useActionState } from "react";
import { PLANS, PLAN_LABELS, type Plan } from "@/lib/leadSchema";
import { submitLead, initialLeadState, HONEYPOT_FIELD } from "@/app/actions/submitLead";

const inputBase =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-teal";
const labelBase = "grid gap-1.5 text-left text-sm font-medium text-navy";

export default function LeadForm({ initialPlan = "free-check" }: { initialPlan?: Plan }) {
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState);

  if (state.status === "success") {
    return (
      <div className="py-6 text-center">
        <p className="text-xl font-bold text-navy">Thanks — we got it. 🎉</p>
        <p className="mt-2 text-grey">
          We&rsquo;ll review your clinic and get back to you shortly at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      {/* Honeypot: hidden from humans, catches bots. */}
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelBase}>
          Name
          <input
            name="name"
            required
            className={inputBase}
            aria-invalid={!!state.fieldErrors?.name}
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          />
          {state.fieldErrors?.name && (
            <span id="name-error" className="font-normal text-coral">{state.fieldErrors.name}</span>
          )}
        </label>
        <label className={labelBase}>
          Clinic name
          <input
            name="clinic"
            required
            className={inputBase}
            aria-invalid={!!state.fieldErrors?.clinic}
            aria-describedby={state.fieldErrors?.clinic ? "clinic-error" : undefined}
          />
          {state.fieldErrors?.clinic && (
            <span id="clinic-error" className="font-normal text-coral">{state.fieldErrors.clinic}</span>
          )}
        </label>
      </div>

      <label className={labelBase}>
        Email
        <input
          name="email"
          type="email"
          required
          className={inputBase}
          aria-invalid={!!state.fieldErrors?.email}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
        />
        {state.fieldErrors?.email && (
          <span id="email-error" className="font-normal text-coral">{state.fieldErrors.email}</span>
        )}
      </label>

      <label className={labelBase}>
        Plan of interest
        <select name="plan" defaultValue={initialPlan} className={inputBase}>
          {PLANS.map((p) => (
            <option key={p} value={p}>
              {PLAN_LABELS[p]}
            </option>
          ))}
        </select>
      </label>

      <label className={labelBase}>
        Anything we should know? (optional)
        <textarea name="message" rows={4} className={inputBase} />
      </label>

      {state.status === "error" && state.message && (
        <p className="text-left text-sm text-coral">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-lg bg-teal px-8 py-4 text-[17px] font-semibold text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
      >
        {pending ? "Sending…" : "Send my request"}
      </button>
    </form>
  );
}
