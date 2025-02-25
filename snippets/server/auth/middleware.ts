import { NextRequest, NextResponse } from "next/server";
import {
  handleAndReturnErrorResponse,
  SlatServerError,
} from "@/lib/services/api";
import { getUserIdFromToken } from "@/lib/auth/actions";

// lib/auth/middleware.ts

export type RouteHandler<
  T extends Record<string, string> = Record<string, string>
> = (
  req: NextRequest,
  userId: number,
  params: Promise<T>
) => Promise<NextResponse> | NextResponse;

export function withAuth<T extends Record<string, string>>(
  handler: RouteHandler<T>
): (
  req: NextRequest,
  context: { params: Promise<T> }
) => Promise<NextResponse> {
  return async function (
    req: NextRequest,
    context: { params: Promise<T> }
  ): Promise<NextResponse> {
    try {
      const userId = await getUserIdFromToken();

      if (!userId) {
        throw new SlatServerError({
          code: "unauthorized",
          message: "Unauthorized",
        });
      }

      return await handler(req, userId, context.params);
    } catch (e) {
      return handleAndReturnErrorResponse(e);
    }
  };
}
