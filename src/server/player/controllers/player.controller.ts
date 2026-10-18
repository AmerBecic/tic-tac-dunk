import { NextRequest, NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import type { GetPlayersRequest } from '@/domains/player/types/get.players.request.dto';
import type { GetPlayersResponse } from '@/domains/player/types/get.players.response.dto';
import { playerService } from '../services/player.service';
import { handleApiError } from '@/server/errors/handle-api-error';

export async function getPlayers(
  request: NextRequest
): Promise<NextResponse<GetPlayersResponse>> {
  const params = request.nextUrl.searchParams;
  const pageParam = params.get('page');
  const limitParam = params.get('limit');
  const page = pageParam === null ? 1 : Number(pageParam);
  const limit = limitParam === null ? 20 : Number(limitParam);
  const headers = { 'Cache-Control': 'no-store' };

  const query: GetPlayersRequest = {
    search: params.get('search')?.trim() ?? '',
    page,
    limit,
  };
  try {
    const response: GetPlayersResponse = await playerService.getPlayers(
      query,
      createSupabase()
    );
    return NextResponse.json(response, { headers });
  } catch (error) {
    return handleApiError(error, headers);
  }
}
