export type Player = {
  id: string;
  name: string;
  first_season: number;
  last_season: number;
  teams: string[] | null;
  main_team: string | null;
  highest_fg_percentage: number;
  highest_season_points_total: number;
  mvp: boolean;
  dpoy: boolean;
  roy: boolean;
  mip: boolean;
  as: boolean;
  teammate_clue_eligible: boolean;
};
