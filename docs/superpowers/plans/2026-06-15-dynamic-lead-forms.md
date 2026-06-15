# Dynamic Lead/Intake Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static Frontpaged site into a dynamic Next.js app whose "free visibility check" and per-plan signup CTAs open a lead form that emails submissions to `hello@frontpaged.io`.

**Architecture:** Drop `output: "export"`; the app runs as a Next.js Node server. A client `LeadForm` posts to a Server Action (`submitLead`) that validates with zod, drops honeypot spam, and sends an email via Nodemailer + Hostinger SMTP. Deployed on the Hostinger VPS via Coolify (Git auto-deploy, Let's Encrypt SSL).

**Tech Stack:** Next.js 16 (App Router, Server Actions), React 19, TypeScript, Tailwind v4, zod, nodemailer, Vitest, Coolify.

**Spec:** `docs/superpowers/specs/2026-06-15-dynamic-lead-forms-design.md`

---

## File structure

**Create:**
- `src/lib/leadSchema.ts` — zod schema, `Plan` type, plan labels (shared by form, action, mailer)
- `src/lib/mailer.ts` — `buildLeadMessage` (pure), `getTransport`, `sendLeadEmail`
- `src/app/actions/submitLead.ts` — Server Action: validate → spam-check → send
- `src/components/LeadForm.tsx` — client form (fields, honeypot, submit/success/error UI)
- `vitest.config.ts` — test runner config with `@` alias
- `src/lib/leadSchema.test.ts`, `src/lib/mailer.test.ts`, `src/app/actions/submitLead.test.ts`
- `.env.example` — documents required env vars
- `docs/deploy-coolify.md` — VPS/Coolify deploy + DNS cutover runbook

**Modify:**
- `next.config.ts` — remove `output: "export"`
- `package.json` — add deps + `start`/`test` scripts; remove static `preview`/`package` scripts
- `src/app/page.tsx` — async, read `searchParams.plan`, pass `initialPlan` to ContactBand
- `src/components/ContactBand.tsx` — render `LeadForm` in a white card; accept `initialPlan`
- `src/components/Pricing.tsx` — tier CTAs link to `/?plan=<slug>#contact`
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx` — drop `force-static`
- `CLAUDE.md` — document dynamic architecture, forms/email flow, env vars, deploy
- `.gitignore` — ensure `.env` ignored

**Delete:**
- `.github/workflows/deploy.yml` (static `deploy`-branch pipeline)
- `public/.htaccess` (LiteSpeed static config)

---

## Task 1: Convert to dynamic app + add test tooling

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Install dependencies**

Run:
```bash
pnpm add zod nodemailer
pnpm add -D vitest @types/nodemailer
```
Expected: installs succeed; `package.json` gains the deps.

- [ ] **Step 2: Remove static export from `next.config.ts`**

Delete the `output: "export"` line (and its comment). Result:

```ts
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next.js walks up and
  // finds a stray lockfile in the home directory, inferring the wrong root.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },

  // Emit each route with a trailing slash (kept from the original config).
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Update `package.json` scripts**

Set the `scripts` block to (remove `preview` and `package`; add `start` and `test`):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

- [ ] **Step 5: Create `.env.example`**

```bash
# Hostinger SMTP (the hello@frontpaged.io mailbox)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=hello@frontpaged.io
SMTP_PASS=
# Where lead notifications are sent / sent from
LEAD_TO=hello@frontpaged.io
LEAD_FROM=hello@frontpaged.io
```

- [ ] **Step 6: Ensure `.env` is git-ignored**

Run:
```bash
git check-ignore .env || printf "\n# Local secrets\n.env\n" >> .gitignore
```
Expected: `.env` is ignored (either already, or appended).

- [ ] **Step 7: Verify the build still works as a dynamic app**

Run: `pnpm build`
Expected: build succeeds; the route table shows `/` (no "export" step). No `out/` is required.

- [ ] **Step 8: Commit**

```bash
git add next.config.ts package.json pnpm-lock.yaml vitest.config.ts .env.example .gitignore
git commit -m "chore: make app dynamic, add zod/nodemailer + vitest tooling"
```

---

## Task 2: Lead schema (zod)

**Files:**
- Create: `src/lib/leadSchema.ts`
- Test: `src/lib/leadSchema.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/leadSchema.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/leadSchema";

describe("leadSchema", () => {
  const valid = {
    name: "Dr. Lin",
    clinic: "Glow Med Spa",
    email: "lin@glowmedspa.com",
    plan: "authority",
    message: "Interested in Botox content.",
  };

  it("accepts a valid lead", () => {
    const result = leadSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.plan).toBe("authority");
  });

  it("rejects a missing name", () => {
    const result = leadSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("defaults plan to free-check when absent", () => {
    const { plan, ...noPlan } = valid;
    const result = leadSchema.safeParse(noPlan);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.plan).toBe("free-check");
  });

  it("falls back to free-check for an unknown plan", () => {
    const result = leadSchema.safeParse({ ...valid, plan: "platinum" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.plan).toBe("free-check");
  });

  it("allows an omitted message", () => {
    const { message, ...noMsg } = valid;
    const result = leadSchema.safeParse(noMsg);
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/leadSchema.test.ts`
Expected: FAIL — cannot resolve `@/lib/leadSchema`.

- [ ] **Step 3: Write the implementation**

`src/lib/leadSchema.ts`:
```ts
import { z } from "zod";

// Plan a lead is interested in. "free-check" is the default (no specific tier).
export const PLANS = ["free-check", "visibility", "authority", "domination"] as const;
export type Plan = (typeof PLANS)[number];

export const PLAN_LABELS: Record<Plan, string> = {
  "free-check": "Free visibility check",
  visibility: "Visibility",
  authority: "Authority",
  domination: "Domination",
};

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  clinic: z.string().trim().min(1, "Please enter your clinic name"),
  email: z.string().trim().email("Please enter a valid email"),
  // .catch() makes both "missing" and "unknown value" fall back to free-check.
  plan: z.enum(PLANS).catch("free-check"),
  message: z.string().trim().max(2000).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/leadSchema.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/leadSchema.ts src/lib/leadSchema.test.ts
git commit -m "feat: add zod lead schema with plan enum"
```

---

## Task 3: Mailer (build message + send)

**Files:**
- Create: `src/lib/mailer.ts`
- Test: `src/lib/mailer.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/mailer.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildLeadMessage, sendLeadEmail } from "@/lib/mailer";
import type { Lead } from "@/lib/leadSchema";

const lead: Lead = {
  name: "Dr. Lin",
  clinic: "Glow Med Spa",
  email: "lin@glowmedspa.com",
  plan: "authority",
  message: "Interested in Botox content.",
};

beforeEach(() => {
  process.env.LEAD_TO = "hello@frontpaged.io";
  process.env.LEAD_FROM = "hello@frontpaged.io";
});

describe("buildLeadMessage", () => {
  it("builds subject, replyTo, and body from a lead", () => {
    const msg = buildLeadMessage(lead);
    expect(msg.subject).toBe("New lead: Authority — Glow Med Spa");
    expect(msg.replyTo).toBe("lin@glowmedspa.com");
    expect(msg.to).toBe("hello@frontpaged.io");
    expect(msg.text).toContain("Glow Med Spa");
    expect(msg.text).toContain("Authority");
    expect(msg.text).toContain("Interested in Botox content.");
  });

  it("shows (none) when no message is provided", () => {
    const msg = buildLeadMessage({ ...lead, message: undefined });
    expect(msg.text).toContain("(none)");
  });
});

describe("sendLeadEmail", () => {
  it("sends the built message through the transport", async () => {
    const sendMail = vi.fn().mockResolvedValue(undefined);
    await sendLeadEmail(lead, { sendMail } as never);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const arg = sendMail.mock.calls[0][0];
    expect(arg.subject).toBe("New lead: Authority — Glow Med Spa");
    expect(arg.replyTo).toBe("lin@glowmedspa.com");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/mailer.test.ts`
Expected: FAIL — cannot resolve `@/lib/mailer`.

- [ ] **Step 3: Write the implementation**

`src/lib/mailer.ts`:
```ts
import nodemailer, { type Transporter } from "nodemailer";
import { PLAN_LABELS, type Lead } from "@/lib/leadSchema";

export type LeadMessage = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

// Pure: turn a validated lead into the email we send. Trivial to unit test.
export function buildLeadMessage(lead: Lead): LeadMessage {
  const from = process.env.LEAD_FROM ?? "hello@frontpaged.io";
  const to = process.env.LEAD_TO ?? "hello@frontpaged.io";
  const planLabel = PLAN_LABELS[lead.plan];
  const text = [
    "New lead from the Frontpaged site",
    "",
    `Plan of interest: ${planLabel}`,
    `Name:    ${lead.name}`,
    `Clinic:  ${lead.clinic}`,
    `Email:   ${lead.email}`,
    "",
    "Message:",
    lead.message && lead.message.trim() ? lead.message.trim() : "(none)",
  ].join("\n");

  return {
    from,
    to,
    replyTo: lead.email,
    subject: `New lead: ${planLabel} — ${lead.clinic}`,
    text,
  };
}

let cached: Transporter | null = null;

// Build (once) an SMTP transport from env. Called at request time, not build time.
export function getTransport(): Transporter {
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT ?? 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return cached;
}

export async function sendLeadEmail(
  lead: Lead,
  transport: Transporter = getTransport(),
): Promise<void> {
  await transport.sendMail(buildLeadMessage(lead));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/mailer.test.ts`
Expected: PASS (3 tests). No real SMTP connection (transport is injected/mocked).

- [ ] **Step 5: Commit**

```bash
git add src/lib/mailer.ts src/lib/mailer.test.ts
git commit -m "feat: add nodemailer lead mailer (build + send)"
```

---

## Task 4: `submitLead` Server Action

**Files:**
- Create: `src/app/actions/submitLead.ts`
- Test: `src/app/actions/submitLead.test.ts`

- [ ] **Step 1: Write the failing test**

`src/app/actions/submitLead.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/mailer", () => ({ sendLeadEmail: vi.fn() }));

import { submitLead, initialLeadState } from "@/app/actions/submitLead";
import { sendLeadEmail } from "@/lib/mailer";

const mockedSend = vi.mocked(sendLeadEmail);

function fd(fields: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

const good = {
  name: "Dr. Lin",
  clinic: "Glow Med Spa",
  email: "lin@glowmedspa.com",
  plan: "authority",
  message: "Hi",
};

beforeEach(() => {
  mockedSend.mockReset();
  mockedSend.mockResolvedValue(undefined);
});

describe("submitLead", () => {
  it("sends the email and returns success for valid input", async () => {
    const state = await submitLead(initialLeadState, fd(good));
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(state.status).toBe("success");
  });

  it("drops honeypot submissions without sending", async () => {
    const state = await submitLead(initialLeadState, fd({ ...good, company_website: "bot" }));
    expect(mockedSend).not.toHaveBeenCalled();
    expect(state.status).toBe("success");
  });

  it("returns field errors and does not send for invalid input", async () => {
    const state = await submitLead(initialLeadState, fd({ ...good, name: "", email: "nope" }));
    expect(mockedSend).not.toHaveBeenCalled();
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.name).toBeTruthy();
    expect(state.fieldErrors?.email).toBeTruthy();
  });

  it("returns an error state (no silent failure) when sending throws", async () => {
    mockedSend.mockRejectedValueOnce(new Error("smtp down"));
    const state = await submitLead(initialLeadState, fd(good));
    expect(state.status).toBe("error");
    expect(state.message).toContain("hello@frontpaged.io");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/app/actions/submitLead.test.ts`
Expected: FAIL — cannot resolve `@/app/actions/submitLead`.

- [ ] **Step 3: Write the implementation**

`src/app/actions/submitLead.ts`:
```ts
"use server";

import { leadSchema } from "@/lib/leadSchema";
import { sendLeadEmail } from "@/lib/mailer";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "clinic" | "email", string>>;
};

export const initialLeadState: LeadFormState = { status: "idle" };

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: humans never fill this hidden field. Pretend success, drop it.
  const honeypot = formData.get("company_website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    clinic: formData.get("clinic"),
    email: formData.get("email"),
    plan: formData.get("plan"),
    message: formData.get("message") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<LeadFormState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "clinic" || key === "email") {
        fieldErrors[key] ??= issue.message;
      }
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  try {
    await sendLeadEmail(parsed.data);
    return { status: "success" };
  } catch (err) {
    console.error("[submitLead] failed to send lead email:", err);
    return {
      status: "error",
      message:
        "Something went wrong sending your request. Please email hello@frontpaged.io directly.",
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/app/actions/submitLead.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Run the full suite**

Run: `pnpm test`
Expected: PASS (all 13 tests across 3 files).

- [ ] **Step 6: Commit**

```bash
git add src/app/actions/submitLead.ts src/app/actions/submitLead.test.ts
git commit -m "feat: add submitLead server action (validate, honeypot, send)"
```

---

## Task 5: `LeadForm` client component

**Files:**
- Create: `src/components/LeadForm.tsx`

No unit test (interactive UI — covered by manual E2E in Task 8). The component is verified by typecheck/build.

- [ ] **Step 1: Write the component**

`src/components/LeadForm.tsx`:
```tsx
"use client";

import { useActionState } from "react";
import { PLANS, PLAN_LABELS, type Plan } from "@/lib/leadSchema";
import { submitLead, initialLeadState } from "@/app/actions/submitLead";

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
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelBase}>
          Name
          <input name="name" required className={inputBase} />
          {state.fieldErrors?.name && (
            <span className="font-normal text-coral">{state.fieldErrors.name}</span>
          )}
        </label>
        <label className={labelBase}>
          Clinic name
          <input name="clinic" required className={inputBase} />
          {state.fieldErrors?.clinic && (
            <span className="font-normal text-coral">{state.fieldErrors.clinic}</span>
          )}
        </label>
      </div>

      <label className={labelBase}>
        Email
        <input name="email" type="email" required className={inputBase} />
        {state.fieldErrors?.email && (
          <span className="font-normal text-coral">{state.fieldErrors.email}</span>
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
        className="inline-flex items-center justify-center rounded-lg bg-teal px-8 py-4 text-[17px] font-semibold text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send my request"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Typecheck via build**

Run: `pnpm build`
Expected: compiles (the component isn't rendered yet, but must typecheck). PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/LeadForm.tsx
git commit -m "feat: add LeadForm client component"
```

---

## Task 6: Wire CTAs + render the form in the contact section

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/ContactBand.tsx`
- Modify: `src/components/Pricing.tsx`

- [ ] **Step 1: Make `page.tsx` read the `plan` query param**

Replace `src/app/page.tsx` with:
```tsx
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import ContactBand from "@/components/ContactBand";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { PLANS, type Plan } from "@/lib/leadSchema";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const initialPlan: Plan = PLANS.includes(plan as Plan) ? (plan as Plan) : "free-check";

  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Pricing />
        <Faq />
        <ContactBand initialPlan={initialPlan} />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Render `LeadForm` in `ContactBand` (white card on the navy band)**

Replace `src/components/ContactBand.tsx` with:
```tsx
import Container from "./Container";
import LeadForm from "./LeadForm";
import { site } from "@/lib/site";
import type { Plan } from "@/lib/leadSchema";

export default function ContactBand({ initialPlan = "free-check" }: { initialPlan?: Plan }) {
  return (
    <section
      id="contact"
      className="border-t border-line bg-navy py-[72px] text-center text-white"
      aria-labelledby="contact-heading"
    >
      <Container>
        <h2 id="contact-heading" className="text-3xl font-bold tracking-tight sm:text-[34px]">
          See where your clinic stands — free
        </h2>
        <p className="mx-auto mt-3.5 max-w-xl text-lg text-[#bbccdd]">
          We&rsquo;ll run the AI test on your clinic and send a short breakdown of your three
          fastest visibility wins. No pitch required.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 shadow-[0_14px_38px_rgba(0,0,0,0.25)] sm:p-8">
          <LeadForm initialPlan={initialPlan} />
        </div>

        <p className="mt-6 text-[15px] text-[#9fb6cc]">
          Or email us directly:{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </p>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Point Pricing CTAs at the form with the plan preselected**

In `src/components/Pricing.tsx`, change the tier CTA from the `Button` linking to `#contact` to a link carrying the plan slug. Replace the `<Button ...>{t.cta}</Button>` block with:
```tsx
              <Button
                href={`/?plan=${t.name.toLowerCase()}#contact`}
                variant={t.featured ? "solid" : "ghost"}
                className="w-full"
              >
                {t.cta}
              </Button>
```
(The tier names "Visibility"/"Authority"/"Domination" lowercase to the matching `plan` slugs. The hero and header "free visibility check" CTAs already point to `#contact` and need no change — they default to the free-check plan.)

- [ ] **Step 4: Build and verify**

Run: `pnpm build`
Expected: PASS. `/` is now dynamic (reads `searchParams`).

- [ ] **Step 5: Manual smoke check (local)**

Run: `pnpm dev`, then in a browser:
- Visit `http://localhost:3000/` → contact section shows the form (Plan = "Free visibility check").
- Visit `http://localhost:3000/?plan=authority#contact` → form's Plan select defaults to "Authority".
- Click a Pricing CTA (e.g. Authority) → lands on the contact form with that plan selected.

(Submitting needs SMTP env — covered in Task 8. Without env it will show the error state, which is expected here.)

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/ContactBand.tsx src/components/Pricing.tsx
git commit -m "feat: render lead form in contact section, preselect plan from pricing CTAs"
```

---

## Task 7: Remove static-export artifacts + update docs

**Files:**
- Delete: `.github/workflows/deploy.yml`, `public/.htaccess`
- Modify: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Delete the static-deploy pipeline + htaccess**

Run:
```bash
git rm .github/workflows/deploy.yml public/.htaccess
```

- [ ] **Step 2: Remove `force-static` from the three metadata routes**

In each of `src/app/robots.ts`, `src/app/sitemap.ts`, and `src/app/opengraph-image.tsx`, delete the line:
```ts
export const dynamic = "force-static";
```
and its preceding comment. (These were only needed for `output: export`; the routes render fine on a server.)

- [ ] **Step 3: Update `CLAUDE.md`**

Replace the "Meta-goal" hosting bullet and add a Deployment section. Specifically:
- In the **Meta-goal** list, change the "Fast (static export …)" bullet to: `**Fast** dynamic Next.js app (Node server) on a Hostinger VPS via Coolify`.
- Add this section before `## Reference`:
```markdown
## Architecture & deployment

- **Dynamic Next.js app** (App Router, Server Actions) — no longer a static export.
- **Lead forms:** `LeadForm` (client) → `submitLead` server action → zod validation +
  honeypot → email via `lib/mailer` (Nodemailer + Hostinger SMTP) to `hello@frontpaged.io`.
  Pricing CTAs link to `/?plan=<slug>#contact` to preselect a plan.
- **Env vars** (set in Coolify, never committed): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
  `SMTP_PASS`, `LEAD_TO`, `LEAD_FROM`. See `.env.example`.
- **Deploy:** Hostinger VPS running Coolify; auto-deploys on push to `main`. Runbook:
  `docs/deploy-coolify.md`.
- **Tests:** `pnpm test` (Vitest) covers the schema, mailer, and server action.
```

- [ ] **Step 4: Verify build + tests still pass**

Run: `pnpm build && pnpm test`
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: retire static-export pipeline, document dynamic architecture"
```

- [ ] **Step 6: Delete the stale `deploy` branch on the remote**

Run:
```bash
git push origin --delete deploy
```
Expected: remote `deploy` branch removed (it was the static-export output; Coolify builds from `main`). If it errors because it's already gone, ignore.

---

## Task 8: Deploy runbook (Coolify on the VPS) + E2E

**Files:**
- Create: `docs/deploy-coolify.md`

This task is a **manual runbook** the site owner executes (it touches the VPS, secrets, and DNS — not automatable from this repo). Write it precisely so it can be followed step by step.

- [ ] **Step 1: Write `docs/deploy-coolify.md`**

```markdown
# Deploy: Coolify on the Hostinger VPS

## 1. Install Coolify on the VPS
- hPanel → VPS → your server → **Choose what to install** → **Application** → **Coolify**
  (or **Plain OS = Ubuntu 22.04** then run Coolify's installer:
  `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`).
- Open Coolify at `http://<VPS_IP>:8000` and create the admin account.

## 2. Connect the repo
- Coolify → **Projects → New** → **Public Repository** (or install the GitHub App for
  private repos) → URL `https://github.com/hexcorpIO/frontpaged-site`, branch `main`.
- Build pack: **Nixpacks** (auto-detects Next.js). Coolify runs `pnpm install`,
  `pnpm build`, `pnpm start`. Exposed port: **3000**.

## 3. Set environment variables (Coolify → app → Environment Variables)
- `SMTP_HOST=smtp.hostinger.com`
- `SMTP_PORT=465`
- `SMTP_USER=hello@frontpaged.io`
- `SMTP_PASS=<the hello@frontpaged.io mailbox password>`
- `LEAD_TO=hello@frontpaged.io`
- `LEAD_FROM=hello@frontpaged.io`

## 4. First deploy on a temporary domain
- Set the app's domain to the Coolify-provided URL or a subdomain `app.frontpaged.io`
  (add an A record `app` → `<VPS_IP>` in Hostinger DNS).
- Click **Deploy**. Wait for build → running.

## 5. E2E test (do this before cutover)
- Open the temp URL. Submit the form from each entry point:
  - Home (`/`) free-check → submit → confirm "Thanks" UI and an email arrives at
    hello@frontpaged.io with Plan = "Free visibility check".
  - `/?plan=authority#contact` → submit → email shows Plan = "Authority".
- Check the email isn't spam-filed (SPF/DKIM for frontpaged.io should pass since
  we send from the domain's own mailbox). If deliverability is poor, switch the
  transport to Resend (see spec "Risks").

## 6. Cutover the apex domain
- In Coolify, set the app domain to `https://frontpaged.io` (and `www`). Enable SSL
  (Let's Encrypt) — Coolify provisions the cert automatically.
- In Hostinger DNS, point the apex **A record** `@` → `<VPS_IP>` (and `www` CNAME/A).
- Wait for DNS propagation; verify `https://frontpaged.io` serves the app over HTTPS
  and the form still emails you.
- Enable **auto-deploy** (Coolify webhook → GitHub repo → Settings → Webhooks) so
  pushes to `main` redeploy. Remove the old static deployment once confirmed.
```

- [ ] **Step 2: Commit**

```bash
git add docs/deploy-coolify.md
git commit -m "docs: add Coolify VPS deploy + DNS cutover runbook"
```

- [ ] **Step 3: Push everything**

```bash
git push origin main
```

---

## Self-review notes

- **Spec coverage:** static→dynamic (T1, T7); forms + plan preselect (T5, T6); Server
  Action + zod + honeypot + no-silent-failure (T2, T4); email via Nodemailer/Hostinger
  SMTP (T3, T8 env); deploy on VPS/Coolify + DNS cutover (T8); cleanup + docs (T7, T8).
- **Out of scope confirmed absent:** no auth, payments, DB, auto-reply.
- **Type consistency:** `Lead`, `Plan`, `PLANS`, `PLAN_LABELS` defined in T2 and reused
  verbatim in T3/T4/T5/T6; `LeadFormState`/`initialLeadState` defined in T4 and consumed
  in T5; `sendLeadEmail(lead, transport?)` signature consistent across T3 (def), T4
  (mocked), T5/T6 (indirect).
- **No placeholders:** every code/step is concrete.
```
