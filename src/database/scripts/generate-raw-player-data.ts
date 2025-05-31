import fs from 'fs';

import { PlayerSeason, Player } from './types';

const rawJson = fs.readFileSync('data/json/player_seasons.json', 'utf-8');

const playerSeasons = JSON.parse(rawJson) as PlayerSeason[];

// Group by player name
const groupsByName = new Map<string, Player[]>();

const GAP_THRESHOLD = 2;

for (const singlePlayerSeason of playerSeasons) {
  const {
    season,
    age,
    playerName,
    team,
    fgPercentage,
    seasonPointsTotal,
    mvp,
    dpoy,
    roy,
    mip,
    as,
  } = singlePlayerSeason;

  // If this player does not yet exist in the map, create a new player
  if (!groupsByName.has(playerName)) {
    const initialGroup: Player = {
      name: playerName,
      allSeasons: [season],
      allAges: [age],
      teams: [team],
      highestFGPercentage: fgPercentage,
      highestSeasonPointsTotal: seasonPointsTotal,
      mvp,
      dpoy,
      roy,
      mip,
      as,
    };
    groupsByName.set(playerName, [initialGroup]);
    continue;
  }

  //attempt to merge into one of the existing clusters
  const groupList = groupsByName.get(playerName)!;
  let mergedIntoExisting = false;

  // check each group in turn, looking at its last recorded season
  for (const group of groupList) {
    // Find the most recent season in this group:
    const lastRecordedSeason = group.allSeasons[group.allSeasons.length - 1];
    const lastRecordedAge = group.allAges[group.allAges.length - 1];

    const seasonGap = season - lastRecordedSeason;
    const ageGap = age - lastRecordedAge;
    const gapDiff = Math.abs(seasonGap - ageGap);

    // If the gap is small enough, merge into this group:
    if (gapDiff <= GAP_THRESHOLD) {
      // Append season and team if not already present
      if (!group.allSeasons.includes(season)) {
        group.allSeasons.push(season);
        group.allAges.push(age);
      }
      if (!group.teams.includes(team)) {
        group.teams.push(team);
      }

      //Update highest FG% and PTS total if needed
      if (fgPercentage > group.highestFGPercentage) {
        group.highestFGPercentage = fgPercentage;
      }
      if (seasonPointsTotal > group.highestSeasonPointsTotal) {
        group.highestSeasonPointsTotal = seasonPointsTotal;
      }

      if (mvp) group.mvp = true;
      if (dpoy) group.dpoy = true;
      if (roy) group.roy = true;
      if (mip) group.mip = true;
      if (as) group.as = true;

      mergedIntoExisting = true;
      break;
    }
  }

  // If we didn’t merge into any existing group, start a new one
  if (!mergedIntoExisting) {
    const newGroupIndex = groupList.length + 1;
    const newGroupName = `${playerName} #${newGroupIndex}`;

    const newGroup: Player = {
      name: newGroupName,
      allSeasons: [season],
      allAges: [age],
      teams: [team],
      highestFGPercentage: fgPercentage,
      highestSeasonPointsTotal: seasonPointsTotal,
      mvp,
      dpoy,
      roy,
      mip,
      as,
    };
    groupList.push(newGroup);
  }
}

//Flatten all groups into one array of Player objects & sort
const allPlayers: Player[] = [];
Array.from(groupsByName.values()).forEach((groups): void => {
  allPlayers.push(...groups);
});

allPlayers.sort((a, b): number => a.name.localeCompare(b.name));

fs.writeFileSync(
  'data/json/players_raw.json',
  JSON.stringify(allPlayers, null, 2),
  'utf-8'
);

console.log(
  `Exported ${allPlayers.length} records to data/json/players_raw.json`
);
