import 'server-only';
import { NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import type { CreateMatchRequest } from '@/domains/tic-tac-toe/types/create.match.request.dto';
import type { CreateMatchResponse } from '@/domains/tic-tac-toe/types/create.match.response.dto';
import { ticTacToeService } from '../services/tic-tac-toe.service';

export async function createMatch(
  request: Request
): Promise<NextResponse<CreateMatchResponse>> {
  const headers = { 'Cache-Control': 'no-store' };
  const token = request.headers
    .get('authorization')
    ?.match(/^Bearer\s+(\S+)$/i)?.[1];

  if (!token)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: CreateMatchRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const supabase = createSupabase();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const response = await ticTacToeService.createMatch(
      body,
      data.user.id,
      supabase
    );

    return NextResponse.json<CreateMatchResponse>(response, {
      status: 201,
      headers,
    });
  } catch (error) {
    console.error('Match creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create match.' },
      { status: 500, headers }
    );
  }
}
