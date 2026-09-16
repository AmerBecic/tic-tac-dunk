import 'server-only';

import { createSupabase } from '@/core/supabase/server';
import { shuffle, type CategoryCounts } from './generator';
import {
  ACHIEVEMENT_CATEGORIES,
  STAT_CATEGORIES,
} from './category-definitions';
import type { GridCategory } from './types';

type Team = { code: string; name: string; included_names: string[] };
type CluePlayer = { id: string; name: string };

export async function loadRandomCategories(
  counts: CategoryCounts
): Promise<GridCategory[]> {
  const supabase = createSupabase();
  const [teamResult, playerResult] = await Promise.all([
    counts.TEAM > 0
      ? supabase.rpc('get_random_teams', { requested_count: counts.TEAM })
      : Promise.resolve({ data: [], error: null }),
    counts.TEAMMATE > 0
      ? supabase.rpc('get_random_eligible_players', {
          requested_count: counts.TEAMMATE,
        })
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (teamResult.error) throw new Error(teamResult.error.message);
  if (playerResult.error) throw new Error(playerResult.error.message);
  const teams = (teamResult.data ?? []) as Team[];
  const players = (playerResult.data ?? []) as CluePlayer[];
  if (teams.length !== counts.TEAM || players.length !== counts.TEAMMATE) {
    throw new Error(
      'Not enough teams or eligible players for the selected category counts.'
    );
  }
  const categories: GridCategory[] = teams.map((team) => ({
    id: `TEAM:${team.code}`,
    type: 'TEAM',
    label: team.name,
    includedNames: team.included_names,
  }));
  categories.push(
    ...shuffle(ACHIEVEMENT_CATEGORIES).slice(0, counts.ACHIEVEMENT)
  );
  categories.push(...shuffle(STAT_CATEGORIES).slice(0, counts.STAT));
  for (const player of players) {
    categories.push({
      id: `TEAMMATE:${player.id}`,
      type: 'TEAMMATE',
      label: `Teammate of ${player.name}`,
    });
  }
  return categories;
}
