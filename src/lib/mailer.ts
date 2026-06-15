import nodemailer, { type Transporter } from "nodemailer";
import { PLAN_LABELS, type Lead } from "@/lib/leadSchema";

export type LeadMessage = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

// Turn a validated lead into the email we send (reads LEAD_FROM/LEAD_TO from env).
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
