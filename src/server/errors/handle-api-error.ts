import 'server-only';

import { NextResponse } from 'next/server';
import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import type { ApiErrorResponse } from '@/server/types/api-error-response.types';

const STATUS_BY_KIND: Record<AppErrorType, number> = {
  [AppErrorType.VALIDATION]: 400,
  [AppErrorType.UNAUTHORIZED]: 401,
  [AppErrorType.FORBIDDEN]: 403,
  [AppErrorType.NOT_FOUND]: 404,
  [AppErrorType.CONFLICT]: 409,
  [AppErrorType.SERVICE_UNAVAILABLE]: 503,
  [AppErrorType.INTERNAL_SERVER_ERROR]: 500,
};

export function handleApiError(
  error: unknown,
  headers?: HeadersInit
): NextResponse<ApiErrorResponse> {
  if (
    error instanceof AppError &&
    error.kind !== AppErrorType.INTERNAL_SERVER_ERROR
  ) {
    return NextResponse.json(
      { success: false, message: error.message, error: error.code },
      { status: STATUS_BY_KIND[error.kind], headers }
    );
  }

  console.error('Unexpected API error:', error);
  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_SERVER_ERROR',
    },
    { status: 500, headers }
  );
}
