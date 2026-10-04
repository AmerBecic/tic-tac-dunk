BEGIN;

CREATE TYPE public.match_mode AS ENUM ('AI', 'ONLINE');
CREATE TYPE public.match_participant AS ENUM ('PLAYER1', 'PLAYER2');
CREATE TYPE public.match_status AS ENUM ('WAITING', 'ACTIVE', 'FINISHED', 'ABANDONED');
CREATE TYPE public.match_end_reason AS ENUM ('THREE_IN_ROW', 'DRAW', 'FORFEIT');

CREATE TABLE public.matches (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    mode public.match_mode NOT NULL,
    player1_id UUID NOT NULL,
    player2_id UUID,
    grid JSONB NOT NULL,
    board JSONB NOT NULL DEFAULT '[null,null,null,null,null,null,null,null,null]'::jsonb,
    history JSONB NOT NULL DEFAULT '[]'::jsonb,
    status public.match_status NOT NULL DEFAULT 'WAITING',
    current_player public.match_participant,
    winner public.match_participant,
    end_reason public.match_end_reason,
    turn_number INTEGER NOT NULL DEFAULT 0,
    turn_duration_seconds INTEGER NOT NULL,
    turn_ends_at TIMESTAMPTZ(6),
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ(6),
    CONSTRAINT matches_pkey PRIMARY KEY (id),
    CONSTRAINT matches_player1_id_fkey FOREIGN KEY (player1_id)
        REFERENCES auth.users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT matches_player2_id_fkey FOREIGN KEY (player2_id)
        REFERENCES auth.users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT matches_grid_check CHECK (
        CASE
            WHEN jsonb_typeof(grid) = 'object'
                AND jsonb_typeof(grid -> 'rows') = 'array'
                AND jsonb_typeof(grid -> 'columns') = 'array'
            THEN jsonb_array_length(grid -> 'rows') = 3
                AND jsonb_array_length(grid -> 'columns') = 3
            ELSE FALSE
        END
    ),
    CONSTRAINT matches_board_check CHECK (
        CASE WHEN jsonb_typeof(board) = 'array'
            THEN jsonb_array_length(board) = 9
            ELSE FALSE
        END
    ),
    CONSTRAINT matches_history_check CHECK (jsonb_typeof(history) = 'array'),
    CONSTRAINT matches_turn_number_check CHECK (turn_number >= 0),
    CONSTRAINT matches_turn_duration_check CHECK (turn_duration_seconds > 0),
    CONSTRAINT matches_version_check CHECK (version >= 0),
    CONSTRAINT matches_participants_check CHECK (
        (mode <> 'AI' OR player2_id IS NULL)
        AND (player2_id IS NULL OR player1_id <> player2_id)
        AND (mode <> 'ONLINE' OR status <> 'ACTIVE' OR player2_id IS NOT NULL)
    ),
    CONSTRAINT matches_active_turn_check CHECK (
        (status = 'ACTIVE' AND current_player IS NOT NULL AND turn_ends_at IS NOT NULL AND turn_number > 0)
        OR (status <> 'ACTIVE' AND current_player IS NULL AND turn_ends_at IS NULL)
    ),
    CONSTRAINT matches_result_check CHECK (
        (status = 'FINISHED' AND finished_at IS NOT NULL AND end_reason IS NOT NULL
            AND ((end_reason = 'DRAW' AND winner IS NULL)
                OR (end_reason IN ('THREE_IN_ROW', 'FORFEIT') AND winner IS NOT NULL)))
        OR (status = 'ABANDONED' AND finished_at IS NOT NULL AND end_reason IS NULL AND winner IS NULL)
        OR (status IN ('WAITING', 'ACTIVE') AND finished_at IS NULL AND end_reason IS NULL AND winner IS NULL)
    )
);

CREATE INDEX matches_player1_id_created_at_idx ON public.matches (player1_id, created_at);
CREATE INDEX matches_player2_id_created_at_idx ON public.matches (player2_id, created_at);
CREATE INDEX matches_status_turn_ends_at_idx ON public.matches (status, turn_ends_at);

-- Keep timestamps current for Supabase writes as well as Prisma writes.
CREATE FUNCTION public.set_match_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.set_match_updated_at();

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.matches FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.matches TO service_role;

COMMIT;
