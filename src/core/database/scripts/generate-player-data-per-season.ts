import fs from 'fs';

import { parse, Options } from 'csv-parse/sync';

import { PlayerSeason } from './types';

type CSVRow = Record<string, string>;

const parseCSV = parse as unknown as (input: string, opts: Options) => CSVRow[];

// read from raw web-scraped csv file
const rawCsv = fs.readFileSync('data/csv/player_team_1950_2027.csv', 'utf-8');

const allPlayersallSeasons = parseCSV(rawCsv, {
  columns: true,
  skip_empty_lines: true,
});

const allPlayersallSeasonsFlagged: PlayerSeason[] = allPlayersallSeasons.map(
  (playerSeason): PlayerSeason => {
    const awardSet = new Set(
      (playerSeason.Awards ?? '')
        .split(',')
        .map((a): string => a.trim())
        .filter(Boolean)
    );

    return {
      season: parseInt(playerSeason.Season, 10),
      playerName: playerSeason.Player,
      age: parseInt(playerSeason.Age, 10),
      team: playerSeason.Team,
      fgPercentage: parseFloat(playerSeason['FGPercentage']),
      seasonPointsTotal: parseInt(playerSeason.SeasonPointsTotal, 10),
      mvp: awardSet.has('MVP'),
      dpoy: awardSet.has('DPOY'),
      roy: awardSet.has('ROY'),
      mip: awardSet.has('MIP'),
      as: awardSet.has('AS'),
    };
  }
);

// Write to JSON in data/player_seasons_raw
fs.writeFileSync(
  'data/json/player_seasons.json',
  JSON.stringify(allPlayersallSeasonsFlagged, null, 2),
  'utf-8'
);

console.log(
  `Exported ${allPlayersallSeasonsFlagged.length} records to data/player_seasons.json`
);
