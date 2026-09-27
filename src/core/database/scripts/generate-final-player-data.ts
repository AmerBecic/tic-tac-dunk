import fs from 'fs';

import { v4 } from 'uuid';

import { Player, PlayerRaw } from './types';

const rawText = fs.readFileSync('data/json/players_raw.json', 'utf-8');
const rawPlayers = JSON.parse(rawText) as PlayerRaw[];

const players: Player[] = rawPlayers.map((rp): Player => {
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
    mainTeam: rp.mainTeam,
    highestFGPercentage: rp.highestFGPercentage,
    highestSeasonPointsTotal: rp.highestSeasonPointsTotal,
    mvp: rp.mvp,
    dpoy: rp.dpoy,
    roy: rp.roy,
    mip: rp.mip,
    as: rp.as,
  };
});

const countsByBase = new Map<string, number>();

for (const p of players) {
  const [baseName] = p.name.split(' #');
  countsByBase.set(baseName, (countsByBase.get(baseName) || 0) + 1);
}

for (const p of players) {
  const [baseName] = p.name.split(' #');
  if ((countsByBase.get(baseName) || 0) > 1) {
    p.name = `${baseName} (${p.firstSeason}-${p.lastSeason})`;
  }
}

// Reuse IDs for existing records so regenerating data preserves database links.
const outputPath = 'data/json/players_final.json';
const existingPlayers: Player[] = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
  : [];
const identityKey = (player: Player): string =>
  JSON.stringify([
    player.name,
    player.firstSeason,
    player.lastSeason,
    [...player.teams].sort(),
  ]);
const existingIds = new Map<string, string>();
for (const player of existingPlayers) {
  const key = identityKey(player);
  if (existingIds.has(key))
    throw new Error(`Ambiguous existing player: ${player.name}`);
  existingIds.set(key, player.id);
}
for (const player of players) {
  player.id = existingIds.get(identityKey(player)) ?? player.id;
}

fs.writeFileSync(
  'data/json/players_final.json',
  JSON.stringify(players, null, 2),
  'utf-8'
);
console.log(
  `Exported ${players.length} records to 'data/json/players_final.json'`
);
