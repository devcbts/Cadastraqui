-- Trigger to notify changes on EnemScore and optionally update Application.enemScore
-- Assumes a LISTEN channel 'channel_enem_score' is used by the app

-- 1) Function: notify and update applications
CREATE OR REPLACE FUNCTION public.fn_notify_enem_event()
RETURNS trigger AS
$$
DECLARE
  v_candidate_id text;
  v_linguagens   double precision;
  v_matematica   double precision;
  v_humanas      double precision;
  v_natureza     double precision;
  v_redacao      double precision;
  v_composite    double precision;
BEGIN
  -- Resolve NEW vs OLD
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    v_candidate_id := NEW.candidate_id::text;
    v_linguagens   := COALESCE(NEW.linguagens, 0);
    v_matematica   := COALESCE(NEW.matematica, 0);
    v_humanas      := COALESCE(NEW.humanas, 0);
    v_natureza     := COALESCE(NEW.natureza, 0);
    v_redacao      := COALESCE(NEW.redacao, 0);

    -- Compute composite as simple average of five parts
    v_composite := (v_linguagens + v_matematica + v_humanas + v_natureza + v_redacao) / 5.0;

    -- Update open applications (position is NULL) for this candidate
    UPDATE "Application"
      SET "enemScore" = v_composite,
          "updatedAt" = NOW()
    WHERE "candidate_id" = v_candidate_id
      AND "position" IS NULL;

  ELSIF (TG_OP = 'DELETE') THEN
    v_candidate_id := OLD.candidate_id::text;

    -- On delete, clear enemScore for open applications of this candidate
    UPDATE "Application"
      SET "enemScore" = NULL,
          "updatedAt" = NOW()
    WHERE "candidate_id" = v_candidate_id
      AND "position" IS NULL;
  END IF;

  -- Notify listeners with JSON payload (operation + row data)
  PERFORM pg_notify(
    'channel_enem_score',
    json_build_object(
      'operation', TG_OP,
      'data', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END
    )::text
  );

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 2) Trigger: on INSERT/UPDATE/DELETE of EnemScore
DROP TRIGGER IF EXISTS trg_notify_enem_event ON "EnemScore";
CREATE TRIGGER trg_notify_enem_event
AFTER INSERT OR UPDATE OR DELETE ON "EnemScore"
FOR EACH ROW
EXECUTE FUNCTION public.fn_notify_enem_event();
