BEGIN;

CREATE TABLE public.player_teammates (
    player_id TEXT NOT NULL,
    teammate_id TEXT NOT NULL,
    seasons_together INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT player_teammates_pkey
        PRIMARY KEY (player_id, teammate_id),

    CONSTRAINT player_teammates_player_fkey
        FOREIGN KEY (player_id) REFERENCES public.players(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT player_teammates_teammate_fkey
        FOREIGN KEY (teammate_id) REFERENCES public.players(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Store each pair once, in ascending ID order; also prevents self-pairs.
    CONSTRAINT canonical_teammate_pair CHECK (player_id < teammate_id),

    CONSTRAINT positive_seasons_together CHECK (seasons_together > 0)
);

-- The primary key covers player_id lookups; index the other side as well.
CREATE INDEX player_teammates_teammate_id_idx
    ON public.player_teammates(teammate_id);

ALTER TABLE public.player_teammates ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.player_teammates FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT ON TABLE public.player_teammates TO service_role;

COMMIT;
