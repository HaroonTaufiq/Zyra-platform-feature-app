import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UrgencyBadge } from "./UrgencyBadge";

describe("UrgencyBadge", () => {
  it("renders high urgency with red styling", () => {
    render(<UrgencyBadge urgency="high" />);
    const badge = screen.getByTestId("urgency-badge");
    expect(badge).toHaveAttribute("data-urgency", "high");
    expect(badge).toHaveTextContent(/high urgency/i);
    expect(badge.className).toMatch(/red/);
  });

  it("renders low urgency with slate styling", () => {
    render(<UrgencyBadge urgency="low" />);
    const badge = screen.getByTestId("urgency-badge");
    expect(badge).toHaveAttribute("data-urgency", "low");
    expect(badge.className).toMatch(/slate/);
  });
});
