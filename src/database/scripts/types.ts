export interface PlayerSeason {
  season: number;
  playerName: string;
  age: number;
  team: string;
  fgPercentage: number;
  seasonPointsTotal: number;
  mvp: boolean;
  dpoy: boolean;
  roy: boolean;
  mip: boolean;
  as: boolean;
}

export interface Player {
  name: string;
  allSeasons: number[];
  allAges: number[];
  teams: string[];
  highestFGPercentage: number;
  highestSeasonPointsTotal: number;
  mvp: boolean;
  dpoy: boolean;
  roy: boolean;
  mip: boolean;
  as: boolean;
}
