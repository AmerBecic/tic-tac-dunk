import { Player, PrismaClient } from '@/generated/prisma/client';

import players from '../data/json/players_final.json';

const prisma = new PrismaClient();

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
  .catch((e): never => {
    console.error(e);
    process.exit(1);
  })
  .finally((): Promise<void> => prisma.$disconnect());
