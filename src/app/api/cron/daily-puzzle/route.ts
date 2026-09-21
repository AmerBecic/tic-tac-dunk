import { NextRequest, NextResponse } from 'next/server';

import { createSupabase } from '@/core/supabase/Server';
import { generateDailyPuzzle } from '@/domains/grid/api/services/DailyPuzzleService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  try {
    const result = await generateDailyPuzzle(date, createSupabase());
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
