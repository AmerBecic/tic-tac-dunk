import 'server-only';
import { NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import type { CreateMatchRequest } from '@/domains/tic-tac-toe/types/create.match.request.dto';
import type { CreateMatchResponse } from '@/domains/tic-tac-toe/types/create.match.response.dto';
import { ticTacToeService } from '../services/tic-tac-toe.service';
import { getOrCreateSupabaseGuestUser } from '@/core/supabase/user';

export async function createMatch(
  request: Request
): Promise<NextResponse<CreateMatchResponse>> {
  const headers = { 'Cache-Control': 'no-store' };
  let body: CreateMatchRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const { data, error } = await getOrCreateSupabaseGuestUser();
    if (error || !data.user)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );

    const response = await ticTacToeService.createMatch(
      body,
      data.user.id,
      createSupabase()
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
