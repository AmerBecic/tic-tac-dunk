-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstSeason" INTEGER NOT NULL,
    "lastSeason" INTEGER NOT NULL,
    "teams" TEXT[],
    "highestFgPercentage" DOUBLE PRECISION NOT NULL,
    "highestSeasonPointsTotal" INTEGER NOT NULL,
    "mvp" BOOLEAN NOT NULL,
    "dpoy" BOOLEAN NOT NULL,
    "roy" BOOLEAN NOT NULL,
    "mip" BOOLEAN NOT NULL,
    "as" BOOLEAN NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
