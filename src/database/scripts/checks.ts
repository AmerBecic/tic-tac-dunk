import fs from 'fs';

import { Player } from './types';

const rawJson = fs.readFileSync('data/json/players.json', 'utf-8');
const players = JSON.parse(rawJson) as Player[];

const uniqueTeams = new Set<string>();
for (const p of players) {
  for (const t of p.teams) {
    uniqueTeams.add(t);
  }
}

const teamsArray = Array.from(uniqueTeams).sort();
console.log('Unique teams across all players:');
console.log(teamsArray.join(', '));
console.log(`Total distinct teams: ${teamsArray.length}`);
