BEGIN;

CREATE TABLE public.teams (
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    logo_path TEXT,
    included_names TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    CONSTRAINT teams_pkey PRIMARY KEY (code)
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.teams FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT ON TABLE public.teams TO service_role;

COMMIT;
