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
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  try {
    const result = await dailyPuzzleService.generateDailyPuzzle(
      date,
      createSupabase()
    );
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Daily puzzle cron failed:', error);
    return NextResponse.json(
      { success: false, date, error: 'Daily puzzle generation failed.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function getDailyPuzzle(
  _request: NextRequest,
  { params }: { params: Promise<GetDailyPuzzleRequest> }
): Promise<NextResponse<GetDailyPuzzleResponse>> {
  const { date } = await params;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return NextResponse.json(
      { error: 'Invalid date. Expected a valid date in YYYY-MM-DD format.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
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
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch daily puzzle.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
