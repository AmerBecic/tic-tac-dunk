import fs from 'fs';

import { v4 } from 'uuid';

import { FinalPlayer, PlayerRaw } from './types';

const rawText = fs.readFileSync('data/json/players_raw.json', 'utf-8');
const rawPlayers = JSON.parse(rawText) as PlayerRaw[];

const finalPlayers: FinalPlayer[] = rawPlayers.map((rp): FinalPlayer => {
  const seasons = rp.allSeasons.slice();
  seasons.sort((a, b): number => a - b);
  const firstSeason = seasons[0];
  const lastSeason = seasons[seasons.length - 1];

  return {
    id: v4(),
    name: rp.name,
    firstSeason,
    lastSeason,
    teams: rp.teams,
    highestFGPercentage: rp.highestFGPercentage,
    highestSeasonPointsTotal: rp.highestSeasonPointsTotal,
    mvp: rp.mvp,
    dpoy: rp.dpoy,
    roy: rp.roy,
    mip: rp.mip,
    as: rp.as,
  };
});

fs.writeFileSync(
  'data/json/players-final.json',
  JSON.stringify(finalPlayers, null, 2),
  'utf-8'
);
console.log(
  `Exported ${finalPlayers.length} records to 'data/json/players-final.json'`
);
