"use client";

import * as React from "react";
import { ofetch } from "ofetch";
import type {
  SpinTheWheelResponse,
  WheelSegment,
  GameDetails,
} from "@/lib/application/casino/types";

import { Button } from "@/components/casino/game/game-button";
import { GameWrapper } from "@/components/casino/game/game-wrapper";
import { RouletteWheel } from "./_components/roulette-wheel";
import { useCasinoGameSession } from "@/lib/hooks/use-casino-game-session";
import { BetAmountInput } from "@/components/casino/game/game-bet-amount-input";
import { spinWheelSegments } from "@slat/constants";

// app/(casino)/casino/(games)/spin-the-wheel.tsx

export const SpinTheWheelGame = ({ details }: { details: GameDetails }) => {
  const [spinDegree, setSpinDegree] = React.useState(0);

  const {
    setBetAmount,
    setLoading,
    outcome,
    setOutcome,
    betAmount,
    message,
    loading,
    setBalance,
    validateAndInitSession,
    handleError,
  } = useCasinoGameSession();

  const spinWheel = async (guess: WheelSegment["color"]) => {
    try {
      validateAndInitSession(betAmount);

      const {
        outcome,
        balance: newBalance,
        color,
      } = await ofetch<SpinTheWheelResponse>("/api/casino/spin-the-wheel", {
        method: "POST",
        body: {
          betAmount,
          color: guess,
          initialDegree: spinDegree,
        },
        onResponseError({ response }) {
          throw new Error(
            response._data?.message || "An unknown error occurred."
          );
        },
      });

      const segmentIdx = spinWheelSegments.findIndex(
        (segment) => segment.color === color
      );
      const finalDegree = calculateFinalDegree(spinDegree, segmentIdx);

      setSpinDegree(finalDegree);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // wheel spin duration

      setBalance(newBalance);
      setOutcome(outcome);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const getSegmentMultiplier = (color: WheelSegment["color"]): string => {
    const multipler =
      spinWheelSegments.find((segment) => segment.color === color)
        ?.multiplier || 1;
    return `${multipler}x`;
  };

  return (
    <GameWrapper details={details} outcome={outcome} message={message}>
      <div className="flex w-full flex-col items-center justify-center text-center">
        <RouletteWheel segments={spinWheelSegments} degree={spinDegree} />
        <div className="mt-4 w-full space-y-3 p-4">
          <BetAmountInput
            value={betAmount}
            onChange={setBetAmount}
            disabled={loading}
          />
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => spinWheel("yellow")}
                disabled={loading}
                className="bg-yellow-600"
                spanClassname="bg-yellow-500"
              >
                Yellow {getSegmentMultiplier("yellow")}
              </Button>
              <Button
                onClick={() => spinWheel("blue")}
                disabled={loading}
                className="bg-blue-600"
                spanClassname="bg-blue-500"
              >
                Blue {getSegmentMultiplier("blue")}
              </Button>
            </div>
            <Button
              onClick={() => spinWheel("green")}
              disabled={loading}
              className="bg-green-600"
              spanClassname="bg-green-500"
            >
              Green {getSegmentMultiplier("green")}
            </Button>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

const calculateFinalDegree = (
  initialDegree: number,
  segmentIdx: number
): number => {
  const sectionSize = 360 / spinWheelSegments.length;

  const thresholdStart = sectionSize * segmentIdx;
  const thresholdEnd = thresholdStart + sectionSize;

  // generate random degree within the segment range
  const degreeWithinSegment =
    Math.random() * (thresholdEnd - thresholdStart - 14) + thresholdStart + 7; // avoid boundaries with ±7 offset to avoid visual edge cases

  const totalSpins = Math.ceil(initialDegree / 360) + 5; // ensure it's higher than the initial degree
  const extraSpins = totalSpins * 360;

  const finalDegree = extraSpins + degreeWithinSegment;

  return -finalDegree; // negative to rotate clockwise
};
