import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { handleApiError } from '@/server/errors/handle-api-error';
import { getDailyPuzzleDateError } from '@/domains/grid/helpers/DailyPuzzleDate';
import type { GetDailyPuzzleResponse } from '@/domains/grid/types/get.daily.puzzle.response.dto';
import type { GetDailyPuzzleRequest } from '@/domains/grid/types/get.daily.puzzle.request.dto';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabase } from '@/core/supabase/server';
import { dailyPuzzleService } from '@/server/grid/services/daily-puzzle.service';

export async function generateDailyPuzzle(
  request: NextRequest
): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return handleApiError(
      new AppError('Unauthorized', 'UNAUTHORIZED', AppErrorType.UNAUTHORIZED),
      { 'Cache-Control': 'no-store' }
    );
  }

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const date = tomorrow.toISOString().slice(0, 10);
  try {
    const result = await dailyPuzzleService.generateDailyPuzzle(
      date,
      createSupabase()
    );
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return handleApiError(error, { 'Cache-Control': 'no-store' });
  }
}

export async function getDailyPuzzle(
  _request: NextRequest,
  { params }: { params: Promise<GetDailyPuzzleRequest> }
): Promise<NextResponse<GetDailyPuzzleResponse>> {
  const { date } = await params;
  const dateError = getDailyPuzzleDateError(date);
  if (dateError) {
    return handleApiError(
      new AppError(dateError, 'INVALID_PUZZLE_DATE', AppErrorType.VALIDATION),
      { 'Cache-Control': 'no-store' }
    );
  }

  try {
    const data = await dailyPuzzleService.getDailyPuzzle(
      date,
      createSupabase()
    );
    return NextResponse.json(
      { data },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    return handleApiError(error, { 'Cache-Control': 'no-store' });
  }
}
