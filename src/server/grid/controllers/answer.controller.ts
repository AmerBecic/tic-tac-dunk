import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { getSupabaseUser } from '@/core/supabase/user';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import { GRID_SIZE } from '@/domains/grid/types/grid.constants';
import { answerService } from '../services/answer.service';
import { handleApiError } from '@/server/errors/handle-api-error';

export async function validateAnswer(
  request: NextRequest
): Promise<NextResponse> {
  const headers = { 'Cache-Control': 'no-store' };
  let body;
  try {
    body = await request.json();
  } catch {
    return handleApiError(
      new AppError('Invalid JSON.', 'INVALID_JSON', AppErrorType.VALIDATION),
      headers
    );
  }
  if (
    !body ||
    typeof body !== 'object' ||
    (body.source !== 'DAILY' && body.source !== 'MATCH') ||
    !isValidId(body.source === 'DAILY' ? body.puzzleId : body.matchId) ||
    typeof body.playerId !== 'string' ||
    !body.playerId ||
    body.playerId.length > 100 ||
    !Number.isInteger(body.row) ||
    body.row < 0 ||
    body.row >= GRID_SIZE ||
    !Number.isInteger(body.column) ||
    body.column < 0 ||
    body.column >= GRID_SIZE
  ) {
    return handleApiError(
      new AppError(
        'Invalid answer request.',
        'INVALID_ANSWER_REQUEST',
        AppErrorType.VALIDATION
      ),
      headers
    );
  }
  try {
    if (body.source === 'MATCH') {
      const { data, error } = await getSupabaseUser();
      if (error || !data.user) {
        return handleApiError(
          new AppError(
            'Unauthorized',
            'UNAUTHORIZED',
            AppErrorType.UNAUTHORIZED
          ),
          headers
        );
      }
    }
    const data = await answerService.validateAnswer(body, createSupabase());
    return NextResponse.json({ data }, { headers });
  } catch (error) {
    return handleApiError(error, headers);
  }
}

function isValidId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 100;
}
