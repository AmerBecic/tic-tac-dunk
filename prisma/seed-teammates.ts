import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from '@/core/generated/prisma/client';

import seasons from '../data/json/player_seasons.json';
import players from '../data/json/players_final.json';
import rawPlayers from '../data/json/players_raw.json';

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const skipUnmatched = process.argv.includes('--skip-unmatched');
  const baseNameCounts = new Map<string, number>();
  const playersByName = new Map<string, (typeof players)[number][]>();

  for (const player of players) {
    const matches = playersByName.get(player.name) ?? [];
    matches.push(player);
    playersByName.set(player.name, matches);
  }

  for (const raw of rawPlayers) {
    const baseName = raw.name.split(' #')[0];
    baseNameCounts.set(baseName, (baseNameCounts.get(baseName) ?? 0) + 1);
  }

  // Reproduce the existing name suffixes, but never regenerate player IDs.
  const seasonPlayerIds = new Map<string, Set<string>>();
  for (const raw of rawPlayers) {
    const baseName = raw.name.split(' #')[0];
    const firstSeason = Math.min(...raw.allSeasons);
    const lastSeason = Math.max(...raw.allSeasons);
    const name =
      baseNameCounts.get(baseName)! > 1
        ? `${baseName} (${firstSeason}-${lastSeason})`
        : raw.name;
    const matches = (playersByName.get(name) ?? []).filter(
      (player) =>
        player.firstSeason === firstSeason &&
        player.lastSeason === lastSeason &&
        player.teams.length === raw.teams.length &&
        player.teams.every((team) => raw.teams.includes(team))
    );

    if (matches.length !== 1 || raw.allSeasons.length !== raw.allAges.length) {
      throw new Error(`Cannot uniquely identify player: ${name}`);
    }

    for (let i = 0; i < raw.allSeasons.length; i++) {
      const key = JSON.stringify([baseName, raw.allSeasons[i], raw.allAges[i]]);
      const ids = seasonPlayerIds.get(key) ?? new Set<string>();
      ids.add(matches[0].id);
      seasonPlayerIds.set(key, ids);
    }
  }

  const rosters = new Map<string, { season: number; ids: Set<string> }>();
  const unmatched: string[] = [];
  for (const record of seasons) {
    if (/^(TOT|\d+TM)$/i.test(record.team)) continue;

    const key = JSON.stringify([record.playerName, record.season, record.age]);
    const ids = seasonPlayerIds.get(key);
    if (!ids || ids.size !== 1) {
      unmatched.push(key);
      continue;
    }

    const rosterKey = JSON.stringify([record.team, record.season]);
    const roster = rosters.get(rosterKey) ?? {
      season: record.season,
      ids: new Set<string>(),
    };
    roster.ids.add([...ids][0]);
    rosters.set(rosterKey, roster);
  }

  if (unmatched.length) {
    console.warn('Unresolved player season records:', unmatched);
    if (!skipUnmatched) {
      throw new Error(
        `${unmatched.length} season records cannot be matched safely. Fix the source data or explicitly use --skip-unmatched to generate incomplete relationships.`
      );
    }
    console.warn(
      `Skipping ${unmatched.length} records; relationships and counts may be incomplete.`
    );
  }

  const pairs = new Map<
    string,
    { playerId: string; teammateId: string; seasons: Set<number> }
  >();

  for (const roster of rosters.values()) {
    const ids = [...roster.ids].sort();
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = JSON.stringify([ids[i], ids[j]]);
        const pair = pairs.get(key) ?? {
          playerId: ids[i],
          teammateId: ids[j],
          seasons: new Set<number>(),
        };
        pair.seasons.add(roster.season);
        pairs.set(key, pair);
      }
    }
  }

  const rows = [...pairs.values()];
  console.log(
    `Prepared ${rows.length} teammate pairs from ${rosters.size} team seasons.`
  );
  console.log(
    'Relationships represent shared team seasons, not verified roster-date overlap.'
  );
  if (dryRun) {
    console.log(
      'Dry run complete. No database connection or writes performed.'
    );
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not defined');

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    // Verify the source IDs against the database before inserting any pairs.
    const existing = new Map(
      (await prisma.player.findMany({ select: { id: true, name: true } })).map(
        (player) => [player.id, player.name]
      )
    );
    const mismatched = players.filter(
      (player) => existing.get(player.id) !== player.name
    );
    if (mismatched.length) {
      throw new Error(
        `${mismatched.length} source players do not match database IDs/names. Seed the matching players first; do not regenerate UUIDs.`
      );
    }

    const chunkSize = 500;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const values = rows
        .slice(i, i + chunkSize)
        .map(
          (pair) =>
            Prisma.sql`(${pair.playerId}, ${pair.teammateId}, ${pair.seasons.size})`
        );
      // Parameterized bulk upsert replaces counts, so reruns do not inflate them.
      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.player_teammates (player_id, teammate_id, seasons_together)
        VALUES ${Prisma.join(values)}
        ON CONFLICT (player_id, teammate_id)
        DO UPDATE SET seasons_together = EXCLUDED.seasons_together
      `);
    }
    console.log(`Seeded ${rows.length} teammate pairs.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
