import { describe, it } from "vitest";
import {
  calculatePayout,
  generateRandomSlots,
} from "@/lib/application/casino/utils";
import { slotWeights } from "@/lib/application/casino/constants/config";

describe("casino slot machine", () => {
  const simulateSpins = (
    numSpins: number,
    betAmount: number,
    initialBalance: number
  ) => {
    let totalBet = 0;
    let totalWinnings = 0;
    let balance = initialBalance;
    let totalWins = 0;

    const symbolCounts: Record<string, number> = {};

    slotWeights.forEach(({ slot }) => {
      symbolCounts[slot.emoji] = 0; // Initialize counts
    });

    for (let i = 0; i < numSpins; i++) {
      const newSlots = generateRandomSlots();
      totalBet += betAmount;

      const payout = calculatePayout(newSlots, betAmount);
      totalWinnings += payout;
      totalWins += payout > 0 ? 1 : 0;

      if (payout > 0) {
        newSlots.forEach((slot) => {
          symbolCounts[slot.emoji]++;
        });
      }

      balance -= betAmount;
      balance += payout;
    }

    return { totalBet, totalWinnings, balance, totalWins, symbolCounts };
  };

  it("runs multiple simulations and logs results", () => {
    const simulations = 10;
    const numSpins = 1000;
    const betAmount = 1;
    const initialBalance = 1000;

    const results = [];

    console.log(`Running ${simulations} simulations...`);
    console.log(`initialBalance: ${initialBalance}`);

    for (let i = 0; i < simulations; i++) {
      const { totalBet, totalWinnings, balance, totalWins, symbolCounts } =
        simulateSpins(numSpins, betAmount, initialBalance);

      results.push({
        simulation: i + 1,
        totalBet,
        totalWinnings,
        balance,
        totalWins,
        symbolCounts,
      });
    }

    results.forEach(
      ({
        simulation,
        totalBet,
        totalWinnings,
        balance,
        totalWins,
        symbolCounts,
      }) => {
        console.log(`Simulation ${simulation}:`);
        console.log(`  Total Winnings: ${totalWinnings}`);
        console.log(`  Final Balance: ${balance}`);
        console.log(`  Total Wins: ${totalWins}`);
        // console.log(`  Symbol Counts:`, symbolCounts);
        console.log("------------------------------------");
      }
    );

    const averageFinalBalance =
      results.reduce((sum, { balance }) => sum + balance, 0) / simulations;
    console.log(
      `Average Final Balance after ${simulations} simulations: ${averageFinalBalance}`
    );
  });

  it("logs the percentage chance for each emoji", () => {
    const totalWeight = slotWeights.reduce(
      (sum, { weight }) => sum + weight,
      0
    );

    slotWeights.forEach(({ slot, weight }) => {
      const percentage = ((weight / totalWeight) * 100).toFixed(2);
      // console.log(`${slot.emoji}: ${percentage}%`);
    });
  });
});
