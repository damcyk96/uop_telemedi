import { describe, expect, it } from "vitest";
import { isReferralDeadlineInPast, localDateIso } from "./referralDeadline";

const today = new Date(2026, 8, 16, 12, 0, 0);

describe("termin dostarczenia orzeczenia", () => {
  it("odrzuca datę wcześniejszą niż dzisiaj", () => {
    expect(isReferralDeadlineInPast("2026-09-15", today)).toBe(true);
  });

  it("pozwala wybrać dzisiejszą datę", () => {
    expect(isReferralDeadlineInPast("2026-09-16", today)).toBe(false);
  });

  it("pozwala wybrać datę przyszłą", () => {
    expect(isReferralDeadlineInPast("2026-09-17", today)).toBe(false);
  });

  it("wyznacza dzisiejszą datę w lokalnej strefie czasowej", () => {
    expect(localDateIso(today)).toBe("2026-09-16");
  });
});
