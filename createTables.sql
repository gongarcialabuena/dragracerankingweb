-- ============================================
-- EXTENSIONES / FUNCIONES
-- ============================================

-- gen_random_uuid() requiere pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================
-- QUEEN
-- ============================================

CREATE TABLE public.queen (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,

    CONSTRAINT queens_pkey PRIMARY KEY (id)
);


-- ============================================
-- SEASON
-- ============================================

CREATE TABLE public.season (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    franchise text NULL,
    year integer NULL,

    CONSTRAINT season_pkey PRIMARY KEY (id)
);


-- ============================================
-- EPISODE
-- ============================================

CREATE TABLE public.episode (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    season_id uuid NULL,
    number integer NOT NULL,
    title text NULL,

    CONSTRAINT episode_pkey PRIMARY KEY (id),
    CONSTRAINT episode_season_id_fkey
        FOREIGN KEY (season_id)
        REFERENCES public.season (id)
);


-- ============================================
-- PARTICIPATE
-- ============================================

CREATE TABLE public.participate (
    season_id uuid NOT NULL,
    queen_id uuid NOT NULL,
    image_url text NULL,

    CONSTRAINT participate_pkey
        PRIMARY KEY (season_id, queen_id),

    CONSTRAINT participate_queen_id_fkey
        FOREIGN KEY (queen_id)
        REFERENCES public.queen (id),

    CONSTRAINT participate_season_id_fkey
        FOREIGN KEY (season_id)
        REFERENCES public.season (id)
);


-- ============================================
-- POINT TYPE
-- ============================================

CREATE TABLE public.point_type (
    id text NOT NULL,
    label text NOT NULL,
    value numeric NOT NULL,
    "hexaColor" text NULL DEFAULT 'ffffff'::text,

    CONSTRAINT point_type_pkey PRIMARY KEY (id)
);


-- ============================================
-- PROFILES
-- ============================================

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text NULL,
    full_name text NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    role text NOT NULL DEFAULT 'user'::text,

    CONSTRAINT profiles_pkey PRIMARY KEY (id),

    CONSTRAINT profiles_id_fkey
        FOREIGN KEY (id)
        REFERENCES auth.users (id)
        ON DELETE CASCADE,

    CONSTRAINT profiles_role_check
        CHECK (
            role = ANY (
                ARRAY[
                    'user'::text,
                    'admin'::text
                ]
            )
        )
);


-- ============================================
-- PPE REFERENCE
-- ============================================

CREATE TABLE public.ppe_reference (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    queen_id uuid NOT NULL,
    season_id uuid NOT NULL,
    episode_id uuid NOT NULL,

    CONSTRAINT ppe_reference_pkey PRIMARY KEY (id),

    CONSTRAINT ppe_reference_episode_id_fkey
        FOREIGN KEY (episode_id)
        REFERENCES public.episode (id),

    CONSTRAINT ppe_reference_queen_id_fkey
        FOREIGN KEY (queen_id)
        REFERENCES public.queen (id),

    CONSTRAINT ppe_reference_season_id_fkey
        FOREIGN KEY (season_id)
        REFERENCES public.season (id)
);


-- ============================================
-- POINTS PER EPISODE
-- ============================================

CREATE TABLE public.points_per_episode (
    client_id uuid NOT NULL,
    point_type_id text NULL,
    reference_id uuid NOT NULL,

    CONSTRAINT points_per_episode_pkey
        PRIMARY KEY (client_id, reference_id),

    CONSTRAINT points_per_episode_client_id_fkey
        FOREIGN KEY (client_id)
        REFERENCES auth.users (id),

    CONSTRAINT points_per_episode_point_type_id_fkey
        FOREIGN KEY (point_type_id)
        REFERENCES public.point_type (id),

    CONSTRAINT points_per_episode_reference_id_fkey
        FOREIGN KEY (reference_id)
        REFERENCES public.ppe_reference (id)
);


-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER trg_set_episode_number
BEFORE INSERT ON public.episode
FOR EACH ROW
EXECUTE FUNCTION set_episode_number();


CREATE TRIGGER on_queen_delete
BEFORE DELETE ON public.queen
FOR EACH ROW
EXECUTE FUNCTION handle_queen_delete();

-- ============================================
-- FUNCTIONS
-- ============================================

-- ============================================
-- SET EPISODE NUMBER
-- ============================================

CREATE OR REPLACE FUNCTION public.set_episode_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.number IS NULL THEN
        SELECT COALESCE(MAX(number), 0) + 1
        INTO NEW.number
        FROM episode
        WHERE season_id = NEW.season_id;
    END IF;

    RETURN NEW;
END;
$function$;


-- ============================================
-- HANDLE QUEEN DELETE
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_queen_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM participate
    WHERE queen_id = OLD.id;

    DELETE FROM points_per_episode p
    USING ppe_reference r
    WHERE p.reference_id = r.id
      AND r.queen_id = OLD.id;

    DELETE FROM ppe_reference
    WHERE queen_id = OLD.id;

    RETURN OLD;
END;
$function$;


-- ============================================
-- HANDLE NEW USER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (
        id,
        username,
        full_name
    )
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name'
    );

    RETURN NEW;
END;
$function$;


-- ============================================
-- IS ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
    );
$function$;


-- ============================================
-- DELETE POINTS
-- ============================================

CREATE OR REPLACE FUNCTION public.delete_points(p_rows jsonb)
RETURNS void
LANGUAGE sql
AS $function$
DELETE FROM points_per_episode p
USING jsonb_to_recordset(p_rows) AS d(
    client_id uuid,
    reference_id uuid
)
WHERE p.client_id = d.client_id
  AND p.reference_id = d.reference_id;
$function$;


-- ============================================
-- DELETE LAST EPISODE
-- ============================================

CREATE OR REPLACE FUNCTION public.delete_last_episode(p_season_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $function$
DECLARE
    v_episode record;
BEGIN
    SELECT id, number, title
    INTO v_episode
    FROM episode
    WHERE season_id = p_season_id
    ORDER BY number DESC
    LIMIT 1;

    IF v_episode IS NULL THEN
        RETURN json_build_object(
            'deleted', false,
            'message', 'No episodes found'
        );
    END IF;

    DELETE FROM episode
    WHERE id = v_episode.id;

    RETURN json_build_object(
        'deleted', true,
        'id', v_episode.id,
        'number', v_episode.number,
        'title', v_episode.title
    );
END;
$function$;


-- ============================================
-- CREATE QUEEN + PARTICIPATE
-- ============================================

CREATE OR REPLACE FUNCTION public.create_queen_participate(
    p_name text,
    p_season_id uuid,
    p_image_url text
)
RETURNS json
LANGUAGE plpgsql
AS $function$
DECLARE
    v_queen_id uuid;
BEGIN

    INSERT INTO queen(name)
    VALUES (p_name)
    RETURNING queen.id INTO v_queen_id;

    INSERT INTO participate(
        queen_id,
        season_id,
        image_url
    )
    VALUES (
        v_queen_id,
        p_season_id,
        p_image_url
    );

    RETURN (
        SELECT json_build_object(
            'id', q.id,
            'name', q.name,
            'image_url', p.image_url
        )
        FROM queen q
        JOIN participate p
            ON p.queen_id = q.id
        WHERE q.id = v_queen_id
        LIMIT 1
    );

END;
$function$;