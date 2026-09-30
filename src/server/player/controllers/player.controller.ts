import { NextRequest, NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import type { SearchPlayersRequest } from '@/domains/player/types/search.player.request.dto';
import type { SearchPlayersResponse } from '@/domains/player/types/search.player.response.dto';
import { playerService } from '../services/player.service';

export async function searchPlayers(
  request: NextRequest
): Promise<NextResponse<SearchPlayersResponse>> {
  const params = request.nextUrl.searchParams;
  const pageParam = params.get('page');
  const limitParam = params.get('limit');
  const page = pageParam === null ? 1 : Number(pageParam);
  const limit = limitParam === null ? 20 : Number(limitParam);
  const headers = { 'Cache-Control': 'no-store' };

  const query: SearchPlayersRequest = {
    search: params.get('search')?.trim() ?? '',
    page,
    limit,
  };
  try {
    const response: SearchPlayersResponse = await playerService.searchPlayers(
      query,
      createSupabase()
    );
    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Player search failed:', error);
    return NextResponse.json<SearchPlayersResponse>(
      { success: false, error: 'Failed to search players.' },
      { status: 500, headers }
    );
  }
}
