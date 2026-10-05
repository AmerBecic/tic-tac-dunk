BEGIN;

CREATE OR REPLACE FUNCTION public.find_grid_answers(
    _rows JSONB,
    _columns JSONB
)
RETURNS TABLE (
    row_index INTEGER,
    column_index INTEGER,
    player_id TEXT
) AS $$
DECLARE
    category JSONB;
    category_id TEXT;
    category_type TEXT;
    category_ids TEXT[] := ARRAY[]::TEXT[];
BEGIN
    IF jsonb_typeof(_rows) IS DISTINCT FROM 'array'
       OR jsonb_typeof(_columns) IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'Rows and columns must be JSON arrays';
    END IF;

    IF jsonb_array_length(_rows) <> 3 OR jsonb_array_length(_columns) <> 3 THEN
        RAISE EXCEPTION 'A grid requires exactly three rows and three columns';
    END IF;

    FOR category IN SELECT value FROM jsonb_array_elements(_rows || _columns)
    LOOP
        IF jsonb_typeof(category) IS DISTINCT FROM 'object'
           OR jsonb_typeof(category -> 'id') IS DISTINCT FROM 'string'
           OR jsonb_typeof(category -> 'type') IS DISTINCT FROM 'string' THEN
            RAISE EXCEPTION 'Each category requires a string id and type';
        END IF;

        category_id := category ->> 'id';
        category_type := category ->> 'type';

        IF category_id = ANY(category_ids) THEN
            RAISE EXCEPTION 'Duplicate category: %', category_id;
        END IF;
        category_ids := array_append(category_ids, category_id);

        CASE category_type
            WHEN 'TEAM' THEN
                IF NOT EXISTS (
                    SELECT 1 FROM public.teams AS t
                    WHERE category_id = 'TEAM:' || t.code
                ) THEN
                    RAISE EXCEPTION 'Unknown team category: %', category_id;
                END IF;
            WHEN 'TEAMMATE' THEN
                IF NOT EXISTS (
                    SELECT 1 FROM public.players AS p
                    WHERE category_id = 'TEAMMATE:' || p.id
                      AND p.teammate_clue_eligible
                ) THEN
                    RAISE EXCEPTION 'Unknown or ineligible teammate category: %', category_id;
                END IF;
            WHEN 'ACHIEVEMENT' THEN
                IF category_id NOT IN ('ACHIEVEMENT:mvp-or-dpoy', 'ACHIEVEMENT:roy-or-mip') THEN
                    RAISE EXCEPTION 'Unknown achievement category: %', category_id;
                END IF;
            WHEN 'STAT' THEN
                IF category_id <> 'STAT:season-points:gte:2000' THEN
                    RAISE EXCEPTION 'Unknown stat category: %', category_id;
                END IF;
            ELSE
                RAISE EXCEPTION 'Unsupported category type: %', category_type;
        END CASE;
    END LOOP;

    RETURN QUERY
    WITH categories AS (
        SELECT (c.ordinality - 1)::INTEGER AS position,
               c.value ->> 'id' AS id,
               c.value ->> 'type' AS type
        FROM jsonb_array_elements(_rows || _columns) WITH ORDINALITY AS c(value, ordinality)
    ),
    memberships AS MATERIALIZED (
        SELECT c.position, p.id AS player_id
        FROM categories AS c
        CROSS JOIN public.players AS p
        WHERE CASE c.type
            WHEN 'TEAM' THEN substring(c.id FROM 6) = ANY(p.teams)
            WHEN 'ACHIEVEMENT' THEN CASE c.id
                WHEN 'ACHIEVEMENT:mvp-or-dpoy' THEN p.mvp OR p.dpoy
                WHEN 'ACHIEVEMENT:roy-or-mip' THEN p.roy OR p.mip
                ELSE false
            END
            WHEN 'STAT' THEN p.highest_season_points_total >= 2000
            WHEN 'TEAMMATE' THEN
                p.id <> substring(c.id FROM 10)
                AND EXISTS (
                    SELECT 1 FROM public.player_teammates AS pt
                    WHERE (pt.player_id = substring(c.id FROM 10) AND pt.teammate_id = p.id)
                       OR (pt.teammate_id = substring(c.id FROM 10) AND pt.player_id = p.id)
                )
            ELSE false
        END
    )
    SELECT r.position,
           (c.position - 3)::INTEGER,
           (
               SELECT rm.player_id::TEXT
               FROM memberships AS rm
               JOIN memberships AS cm ON cm.player_id = rm.player_id
               WHERE rm.position = r.position AND cm.position = c.position
               ORDER BY random() LIMIT 1
           )
    FROM categories AS r
    CROSS JOIN categories AS c
    WHERE r.position < 3 AND c.position >= 3
    ORDER BY r.position, c.position;
END;
$$ LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
SET search_path = '';

REVOKE ALL ON FUNCTION public.find_grid_answers(JSONB, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.find_grid_answers(JSONB, JSONB) TO service_role;

COMMIT;
