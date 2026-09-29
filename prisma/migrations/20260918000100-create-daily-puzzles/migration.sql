BEGIN;

CREATE TABLE public.daily_puzzles (
    id TEXT NOT NULL,
    puzzle_date DATE NOT NULL,
    grid_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT daily_puzzles_pkey PRIMARY KEY (id),
    CONSTRAINT daily_puzzles_puzzle_date_key UNIQUE (puzzle_date),
    CONSTRAINT daily_puzzles_grid_data_check CHECK (
        CASE
            WHEN jsonb_typeof(grid_data) = 'object'
                AND jsonb_typeof(grid_data -> 'rows') = 'array'
                AND jsonb_typeof(grid_data -> 'columns') = 'array'
            THEN jsonb_array_length(grid_data -> 'rows') = 3
                AND jsonb_array_length(grid_data -> 'columns') = 3
            ELSE FALSE
        END
    )
);

GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT ON TABLE public.daily_puzzles TO service_role;

CREATE FUNCTION public.reject_daily_puzzle_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'Published daily puzzles cannot be updated, deleted, or truncated.'
        USING ERRCODE = '55000';
END;
$$;

CREATE TRIGGER daily_puzzles_immutable
BEFORE UPDATE OR DELETE OR TRUNCATE ON public.daily_puzzles
FOR EACH STATEMENT EXECUTE FUNCTION public.reject_daily_puzzle_mutation();

COMMIT;
