BEGIN;

CREATE OR REPLACE FUNCTION public.search_players(
    _search TEXT DEFAULT NULL,
    _offset INTEGER DEFAULT 0,
    _limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    first_season INTEGER,
    last_season INTEGER,
    teams TEXT[],
    main_team TEXT,
    highest_fg_percentage DOUBLE PRECISION,
    highest_season_points_total INTEGER,
    mvp BOOLEAN,
    dpoy BOOLEAN,
    roy BOOLEAN,
    mip BOOLEAN,
    "as" BOOLEAN,
    teammate_clue_eligible BOOLEAN,
    total_count BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF _offset IS NULL OR _offset < 0 THEN
        RAISE EXCEPTION '_offset must be greater than or equal to 0'
            USING ERRCODE = '22023';
    END IF;

    IF _limit IS NULL OR _limit < 1 OR _limit > 100 THEN
        RAISE EXCEPTION '_limit must be between 1 and 100'
            USING ERRCODE = '22023';
    END IF;

    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.first_season,
        p.last_season,
        p.teams,
        p.main_team,
        p.highest_fg_percentage,
        p.highest_season_points_total,
        p.mvp,
        p.dpoy,
        p.roy,
        p.mip,
        p."as",
        p.teammate_clue_eligible,
        COUNT(*) OVER() AS total_count
    FROM public.players AS p
    WHERE COALESCE(_search, '') = ''
        OR p.name ILIKE '%' || _search || '%'
    OFFSET _offset
    LIMIT _limit;
END;
$$;

REVOKE ALL ON FUNCTION public.search_players(TEXT, INTEGER, INTEGER)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_players(TEXT, INTEGER, INTEGER)
    TO service_role;

COMMIT;
