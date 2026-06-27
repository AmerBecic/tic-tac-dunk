CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "first_season" INTEGER NOT NULL,
    "last_season" INTEGER NOT NULL,
    "teams" TEXT[],
    "highest_fg_percentage" DOUBLE PRECISION NOT NULL,
    "highest_season_points_total" INTEGER NOT NULL,
    "mvp" BOOLEAN NOT NULL,
    "dpoy" BOOLEAN NOT NULL,
    "roy" BOOLEAN NOT NULL,
    "mip" BOOLEAN NOT NULL,
    "as" BOOLEAN NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);
