BEGIN;

ALTER TABLE public.players
ADD COLUMN teammate_clue_eligible BOOLEAN NOT NULL DEFAULT false;

UPDATE public.players
SET teammate_clue_eligible = (
    (mvp OR dpoy OR highest_season_points_total > 2000)
    AND last_season > 1995
);

COMMIT;
