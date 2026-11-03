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

export interface PlayerRaw {
  name: string;
  allSeasons: number[];
  allAges: number[];
  teams: string[];
  mainTeam: string | null;
  highestFGPercentage: number;
  highestSeasonPointsTotal: number;
  mvp: boolean;
  dpoy: boolean;
  roy: boolean;
  mip: boolean;
  as: boolean;
}

export interface Player {
  id: string;
  name: string;
  firstSeason: number;
  lastSeason: number;
  teams: string[];
  mainTeam: string | null;
  highestFGPercentage: number;
  highestSeasonPointsTotal: number;
  mvp: boolean;
  dpoy: boolean;
  roy: boolean;
  mip: boolean;
  as: boolean;
}
