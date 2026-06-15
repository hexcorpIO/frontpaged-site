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
