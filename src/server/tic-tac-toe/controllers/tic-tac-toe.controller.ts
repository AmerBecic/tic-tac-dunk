import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { handleApiError } from '@/server/errors/handle-api-error';
import type { GetMatchesRequest } from '@/domains/tic-tac-toe/types/get.matches.request.dto';
import type { GetMatchesResponse } from '@/domains/tic-tac-toe/types/get.matches.response.dto';
import type { Match } from '@/domains/tic-tac-toe/types/match.types';
import { getSupabaseUser } from '@/core/supabase/user';
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
    return handleApiError(
      new AppError(
        'Invalid JSON body.',
        'INVALID_JSON',
        AppErrorType.VALIDATION
      ),
      headers
    );
  }

  try {
    const { data, error } = await getOrCreateSupabaseGuestUser();
    if (error || !data.user)
      return handleApiError(
        new AppError('Unauthorized', 'UNAUTHORIZED', AppErrorType.UNAUTHORIZED),
        headers
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
    return handleApiError(error, headers);
  }
}

export async function getMatches(
  request: Request
): Promise<NextResponse<GetMatchesResponse>> {
  const headers = { 'Cache-Control': 'no-store' };
  const params = new URL(request.url).searchParams;
  const modes = params.getAll('mode');
  const statuses = params.getAll('status');

  const filters: GetMatchesRequest = {
    mode: modes[0] as Match['mode'] | undefined,
    status: statuses.length
      ? ([...new Set(statuses)] as Match['status'][])
      : undefined,
  };
  try {
    const { data, error } = await getSupabaseUser();
    if (error || !data.user) {
      return handleApiError(
        new AppError('Unauthorized', 'UNAUTHORIZED', AppErrorType.UNAUTHORIZED),
        headers
      );
    }
    const response = await ticTacToeService.getMatches(
      filters,
      data.user.id,
      createSupabase()
    );
    return NextResponse.json(response, { headers });
  } catch (error) {
    return handleApiError(error, headers);
  }
}
