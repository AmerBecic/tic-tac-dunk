'use client';

import { TEAM_COLORS } from '@/domains/team/types/team.constants';
import { useUserStore } from '@/providers/UserStoreProvider';

export const useFavouriteTeamColors = () => {
  const favouriteTeam = useUserStore((state) => state.favouriteTeam);
  const colors =
    favouriteTeam && Object.hasOwn(TEAM_COLORS, favouriteTeam)
      ? TEAM_COLORS[favouriteTeam]
      : undefined;

  return colors
    ? { jerseyColor: colors.primaryColor, trimColor: colors.secondaryColor }
    : undefined;
};
