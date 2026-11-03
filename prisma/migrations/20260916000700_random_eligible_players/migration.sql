CREATE OR REPLACE FUNCTION public.get_random_eligible_players(
    requested_count INTEGER
)
RETURNS TABLE (
    id TEXT,
    name TEXT
) AS $$
BEGIN
    IF requested_count IS NULL OR requested_count < 0 OR requested_count > 6 THEN
        RAISE EXCEPTION 'requested_count must be between 0 and 6';
    END IF;

    RETURN QUERY
    SELECT
        p.id AS id,
        p.name AS name
    FROM public.players AS p
    WHERE p.teammate_clue_eligible = true
    ORDER BY random()
    LIMIT requested_count;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = '';

REVOKE ALL ON FUNCTION public.get_random_eligible_players(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_random_eligible_players(INTEGER) TO service_role;
