import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/mailer", () => ({ sendLeadEmail: vi.fn() }));

import { submitLead } from "@/app/actions/submitLead";
import { initialLeadState } from "@/app/actions/submitLeadTypes";
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
