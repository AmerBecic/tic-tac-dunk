import { NextRequest, NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import { GRID_SIZE } from '@/domains/grid/types/grid.constants';
import { answerService } from '../services/answer.service';

export async function validateAnswer(
  request: NextRequest
): Promise<NextResponse> {
  const headers = { 'Cache-Control': 'no-store' };
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON.' },
      { status: 400, headers }
    );
  }
  if (
    !body ||
    typeof body !== 'object' ||
    typeof body.puzzleId !== 'string' ||
    !body.puzzleId ||
    body.puzzleId.length > 100 ||
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
    return NextResponse.json(
      { error: 'Invalid answer request.' },
      { status: 400, headers }
    );
  }
  try {
    const data = await answerService.validateAnswer(body, createSupabase());
    if (!data)
      return NextResponse.json(
        { error: 'Puzzle or player not found.' },
        { status: 404, headers }
      );
    return NextResponse.json({ data }, { headers });
  } catch (error) {
    console.error('Answer validation failed:', error);
    return NextResponse.json(
      { error: 'Unable to validate answer.' },
      { status: 500, headers }
    );
  }
}
