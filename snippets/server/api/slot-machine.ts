import type { NextRequest } from "next/server";
import type { SlotMachineResponse } from "@/lib/application/casino/types";
import { returnSuccessResponse } from "@/lib/services/api";
import { updateBalance } from "@/lib/application/casino/actions/update-balance";
import { notifyWebhook } from "@/lib/services/webhook";
import { slotMachinePayload } from "@/lib/application/casino/schemas";
import {
  calculatePayout,
  generateRandomSlots,
} from "@/lib/application/casino/utils";
import { YELLOW_COLOR } from "@/utils/constants/colors";
import { validateBetOrThrow } from "@/lib/application/casino/actions/validate-bet-or-throw";
import { withAuth } from "@/lib/auth/middleware";
import { getCasinoUserById } from "@/lib/application/casino/actions/get-casino-user";
import { joinStringsWithSpaces } from "@/utils";

// app/api/casino/slot-machine/route.ts

async function handler(req: NextRequest, userId: number) {
  const user = await getCasinoUserById(userId);

  const data = await req.json();

  const { betAmount } = slotMachinePayload.parse(data);

  validateBetOrThrow(betAmount, user.balance);

  const newSlots = generateRandomSlots();
  const winnings = calculatePayout(newSlots, betAmount);
  const win = winnings > 0;
  const payout = win ? winnings : -betAmount;

  const newBalance = await updateBalance({
    payout: payout,
    userId: user.id,
    balance: user.balance,
  });

  notifyWebhook().casino({
    user,
    newBalance,
    betAmount,
    oldBalance: user.balance,
    payout,
    color: YELLOW_COLOR,
    name: "🎰 Slot Machine",
    fields: [
      {
        name: "Slots",
        value: joinStringsWithSpaces(newSlots.map((slot) => slot.emoji)),
        inline: true,
      },
      {
        name: "Multiplier",
        value: `${(payout / betAmount).toFixed(2)}x`,
        inline: true,
      },
    ],
  });

  return returnSuccessResponse<SlotMachineResponse>({
    balance: newBalance,
    outcome: win ? "win" : "lose",
    slots: newSlots,
    payout: payout,
  });
}

export const POST = withAuth(handler);
