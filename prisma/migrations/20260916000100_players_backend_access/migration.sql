BEGIN;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Block direct player access through anonymous and signed-in clients.
REVOKE ALL ON TABLE public.players FROM anon, authenticated;

-- Allow the server's secret-key client to read players.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT ON TABLE public.players TO service_role;

COMMIT;
