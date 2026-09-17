import * as NBAIcons from 'react-nba-logos';

export const TEAM_LOGOS: Record<string, typeof NBAIcons.TOR | undefined> = {
  ...NBAIcons,
  BRK: NBAIcons.BKN,
  CHO: NBAIcons.CHA,
  PHO: NBAIcons.PHX,
};
