import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/core/generated/prisma/client';

import players from '../data/json/players_final.json';
import { teams, validateTeamCodes } from './data/teams';

async function main(): Promise<void> {
  validateTeamCodes(players.flatMap((player) => player.teams));

  if (process.argv.includes('--dry-run')) {
    console.log(
      `Validated ${teams.length} teams and all source player team codes. No database writes.`
    );
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not defined');

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const existingPlayers = await prisma.player.findMany({
      select: { teams: true },
    });
    validateTeamCodes(existingPlayers.flatMap((player) => player.teams));

    await prisma.$transaction(
      teams.map((team) =>
        prisma.team.upsert({
          where: { code: team.code },
          create: team,
          // Preserve any manually configured logo and eligibility on reruns.
          update: { name: team.name, includedNames: team.includedNames },
        })
      )
    );
    console.log(`Seeded ${teams.length} teams.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
