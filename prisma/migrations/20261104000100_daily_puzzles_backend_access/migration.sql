BEGIN;

ALTER TABLE public.daily_puzzles
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.daily_puzzles
FROM PUBLIC, anon, authenticated, service_role;

GRANT SELECT, INSERT ON TABLE public.daily_puzzles
TO service_role;

COMMIT;
