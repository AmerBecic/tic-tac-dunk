import type { GetDailyPuzzleResponse } from '@/domains/grid/types/get.daily.puzzle.response.dto';
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

export async function getDailyPuzzle(): Promise<
  NextResponse<GetDailyPuzzleResponse>
> {
  try {
    const data = await dailyPuzzleService.getDailyPuzzle(createSupabase());
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
