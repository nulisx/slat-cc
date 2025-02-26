import * as z from "zod";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

// lib/services/api.ts

export const ErrorCode = z.enum([
  "bad_request",
  "not_found",
  "internal_server_error",
  "unauthorized",
  "forbidden",
  "rate_limit_exceeded",
  "exceeded_limit",
  "conflict",
  "unprocessable_entity",
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

export const httpStatusToErrorCode = Object.fromEntries(
  Object.entries(errorCodeToHttpStatus).map(([code, status]) => [status, code])
) as Record<number, z.infer<typeof ErrorCode>>;

export class SlatServerError extends Error {
  public readonly code: z.infer<typeof ErrorCode>;

  constructor({
    code,
    message,
  }: {
    code: z.infer<typeof ErrorCode>;
    message: string;
  }) {
    super(message);
    this.code = code;
    this.name = "SlatServerError";
    Object.setPrototypeOf(this, SlatServerError.prototype);
  }
}

export function handleApiError(error: any): {
  error: { code: string; message: string };
  status: number;
} {
  console.error("API error occurred", error.message);
  console.log(error);

  if (error instanceof ZodError) {
    return {
      error: {
        code: "unprocessable_entity",
        message: generateErrorMessage(error.issues, {
          maxErrors: 1,
          delimiter: {
            component: ": ",
          },
          path: {
            enabled: true,
            type: "objectNotation",
            label: "",
          },
          code: {
            enabled: true,
            label: "",
          },
          message: {
            enabled: true,
            label: "",
          },
        }),
      },
      status: errorCodeToHttpStatus.unprocessable_entity,
    };
  }

  if (error instanceof SlatServerError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
      status: errorCodeToHttpStatus[error.code],
    };
  }

  return {
    error: {
      code: "internal_server_error",
      message: "An internal server error occurred.",
    },
    status: 500,
  };
}

export function handleAndReturnErrorResponse(
  err: unknown,
  headers?: Record<string, string>
): NextResponse {
  const { error, status } = handleApiError(err);

  return NextResponse.json<{
    message: string;
  }>({ message: error.message }, { headers, status });
}

interface ResponseOptions<T = unknown> {
  message: string;
  status?: number;
  data?: T;
}

export function successResponse<Body = unknown>({
  message,
  status = 200,
  data,
  headers,
}: ResponseOptions<Body> & {
  headers?: Record<string, string>;
}): NextResponse {
  return NextResponse.json(
    {
      message,
      data,
      headers,
    },
    { status, headers }
  );
}

// todo: use same function

export function returnSuccessResponse<T = unknown>(
  data: T,
  options: {
    headers?: Record<string, string>;
  } = {}
): NextResponse {
  const { headers = { "Content-Type": "application/json" } } = options;

  return NextResponse.json(
    {
      ...data,
    },
    { status: 200, headers }
  );
}
