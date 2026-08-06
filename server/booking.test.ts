import { describe, expect, it } from "vitest";

function calculateMonetization(totalAmount: number, paymentMethod: "cash" | "online") {
  let platformFee = 0;
  let ownerPayout = totalAmount;
  if (paymentMethod === "online") {
    platformFee = (totalAmount * 0.05) + 150;
    ownerPayout = totalAmount - platformFee;
  }
  return { platformFee, ownerPayout };
}

function calculateSplitAmount(totalAmount: number, coPlayersCount: number) {
  return Math.round(totalAmount / (coPlayersCount + 1));
}

describe("CourtKarao Monetization & Split Math", () => {
  it("calculates cash payment correctly (0 platform fee)", () => {
    const { platformFee, ownerPayout } = calculateMonetization(5000, "cash");
    expect(platformFee).toBe(0);
    expect(ownerPayout).toBe(5000);
  });

  it("calculates online payment correctly (5% + Rs. 150)", () => {
    const { platformFee, ownerPayout } = calculateMonetization(4000, "online");
    expect(platformFee).toBe(4000 * 0.05 + 150); // 200 + 150 = 350
    expect(ownerPayout).toBe(4000 - 350); // 3650
  });

  it("calculates split amount correctly across players", () => {
    const split = calculateSplitAmount(4000, 3); // 4 players total (organizer + 3 co-players)
    expect(split).toBe(1000);
  });
});
