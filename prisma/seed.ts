import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient, type Player } from '@/core/generated/prisma/client';

import players from '../data/json/players_final.json';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const chunkSize = 500;

  for (let i = 0; i < players.length; i += chunkSize) {
    const batch = players.slice(i, i + chunkSize).map(
      (p): Player => ({
        id: p.id,
        name: p.name,
        firstSeason: p.firstSeason,
        lastSeason: p.lastSeason,
        teams: p.teams,
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
  }

  console.log(`Seeded all ${players.length} players`);
}

main()
  .catch((error): never => {
    console.error(error);
    process.exit(1);
  })
  .finally((): Promise<void> => prisma.$disconnect());
