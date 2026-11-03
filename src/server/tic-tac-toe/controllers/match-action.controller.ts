import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { handleApiError } from '@/server/errors/handle-api-error';
import 'server-only';
import { NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import { getSupabaseUser } from '@/core/supabase/user';
import type { MatchActionRequest } from '@/domains/tic-tac-toe/types/match.action.request.dto';
import type { MatchActionResponse } from '@/domains/tic-tac-toe/types/match.action.response.dto';
import { matchActionService } from '../services/match-action.service';

function isAction(value: unknown): value is MatchActionRequest {
  if (!value || typeof value !== 'object') return false;
  const body = value as Record<string, unknown>;
  if (
    !Number.isSafeInteger(body.expectedVersion) ||
    (body.expectedVersion as number) < 0 ||
    (body.expectedVersion as number) >= 2147483647
  )
    return false;
  if (body.action === 'MOVE') {
    return (
      Number.isInteger(body.row) &&
      (body.row as number) >= 0 &&
      (body.row as number) < 3 &&
      Number.isInteger(body.column) &&
      (body.column as number) >= 0 &&
      (body.column as number) < 3 &&
      typeof body.playerId === 'string' &&
      body.playerId.trim().length > 0 &&
      body.playerId.length <= 100
    );
  }
  return (
    typeof body.action === 'string' &&
    [
      'FORFEIT',
      'SKIP',
      'TIMEOUT',
      'AI_TURN',
      'OFFER_DRAW',
      'ACCEPT_DRAW',
      'DECLINE_DRAW',
    ].includes(body.action)
  );
}

export async function updateMatch(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<MatchActionResponse>> {
  const headers = { 'Cache-Control': 'no-store' };
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return handleApiError(
      new AppError(
        'Invalid JSON body.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      ),
      headers
    );
  }
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id
    ) ||
    !isAction(body)
  ) {
    return handleApiError(
      new AppError(
        'Invalid match action request.',
        'INVALID_ACTION',
        AppErrorType.VALIDATION
      ),
      headers
    );
  }
  try {
    const { data, error } = await getSupabaseUser();
    if (error || !data.user)
      throw new AppError(
        'Unauthorized',
        'UNAUTHORIZED',
        AppErrorType.UNAUTHORIZED
      );
    const result = await matchActionService.applyAction(
      id,
      body,
      data.user.id,
      createSupabase()
    );
    return NextResponse.json(result, { headers });
  } catch (error) {
    return handleApiError(error, headers);
  }
}
