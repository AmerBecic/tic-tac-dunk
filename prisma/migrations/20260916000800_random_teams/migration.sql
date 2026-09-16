CREATE OR REPLACE FUNCTION public.get_random_teams(
    requested_count INTEGER
)
RETURNS TABLE (
    code TEXT,
    name TEXT,
    included_names TEXT[]
) AS $$
BEGIN
    IF requested_count IS NULL OR requested_count < 0 OR requested_count > 6 THEN
        RAISE EXCEPTION 'requested_count must be between 0 and 6';
    END IF;

    RETURN QUERY
    SELECT t.code, t.name, t.included_names
    FROM public.teams AS t
    ORDER BY random()
    LIMIT requested_count;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = '';

REVOKE ALL ON FUNCTION public.get_random_teams(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_random_teams(INTEGER) TO service_role;
