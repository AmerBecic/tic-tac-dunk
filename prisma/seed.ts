import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient, type Prisma } from '@/core/generated/prisma/client';

import players from '../data/json/players_final.json';
import { validateTeamCodes } from './data/teams';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  validateTeamCodes(players.flatMap((player) => player.teams));
  validateTeamCodes(
    players.flatMap((player) => (player.mainTeam ? [player.mainTeam] : []))
  );
  const chunkSize = 500;

  for (let i = 0; i < players.length; i += chunkSize) {
    const batch = players.slice(i, i + chunkSize).map(
      (p): Prisma.PlayerCreateManyInput => ({
        id: p.id,
        name: p.name,
        firstSeason: p.firstSeason,
        lastSeason: p.lastSeason,
        teams: p.teams,
        mainTeam: p.mainTeam,
        highestFgPercentage: p.highestFGPercentage ?? 0,
        highestSeasonPointsTotal: p.highestSeasonPointsTotal,
        mvp: p.mvp,
        dpoy: p.dpoy,
        roy: p.roy,
        mip: p.mip,
        as: p.as,
      })
    );

    await prisma.player.createMany({
      data: batch,
      skipDuplicates: true,
    });

    // Backfill existing records as well as newly inserted players.
    const mainTeams = JSON.stringify(
      batch.map((player) => ({
        id: player.id,
        main_team: player.mainTeam,
      }))
    );
    await prisma.$executeRaw`
      UPDATE public.players AS player
      SET main_team = source.main_team
      FROM jsonb_to_recordset(${mainTeams}::jsonb)
        AS source(id text, main_team text)
      WHERE player.id = source.id
    `;
  }

  // Synchronize both new and existing players, including clearing stale eligibility.
  await prisma.$executeRaw`
    UPDATE public.players
    SET teammate_clue_eligible = (
      (mvp OR dpoy OR highest_season_points_total > 2000)
      AND last_season > 1995
    )
  `;

  const eligibleCount = await prisma.player.count({
    where: { teammateClueEligible: true },
  });

  console.log(
    `Seeded all ${players.length} players; ${eligibleCount} eligible as teammate clues`
  );
}

main()
  .catch((error): never => {
    console.error(error);
    process.exit(1);
  })
  .finally((): Promise<void> => prisma.$disconnect());
