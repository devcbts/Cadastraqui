-- Trigger to notify changes on EnemScore and optionally update Application.enemScore
-- Assumes a LISTEN channel 'channel_enem_score' is used by the app

-- 1) Function: notify and update applications
CREATE OR REPLACE FUNCTION public.fn_notify_enem_event()
RETURNS trigger AS
$$
DECLARE
  v_candidate_id uuid;
  v_linguagens   double precision;
  v_matematica   double precision;
  v_humanas      double precision;
  v_natureza     double precision;
  v_redacao      double precision;
  v_composite    double precision;
BEGIN
  -- Resolve NEW vs OLD
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    v_candidate_id := NEW.candidate_id::uuid;
    v_linguagens   := COALESCE(NEW.linguagens, 0);
    v_matematica   := COALESCE(NEW.matematica, 0);
    v_humanas      := COALESCE(NEW.humanas, 0);
    v_natureza     := COALESCE(NEW.natureza, 0);
    v_redacao      := COALESCE(NEW.redacao, 0);
  ELSE
    v_candidate_id := OLD.candidate_id::uuid;
    v_linguagens   := COALESCE(OLD.linguagens, 0);
    v_matematica   := COALESCE(OLD.matematica, 0);
    v_humanas      := COALESCE(OLD.humanas, 0);
    v_natureza     := COALESCE(OLD.natureza, 0);
    v_redacao      := COALESCE(OLD.redacao, 0);
  END IF;

  -- Compute composite as simple average of five parts
  v_composite := (v_linguagens + v_matematica + v_humanas + v_natureza + v_redacao) / 5.0;

  -- Update open applications (position is NULL) for this candidate
  UPDATE "Application"
    SET "enemScore" = v_composite,
        "updatedAt" = NOW()
  WHERE "candidate_id" = v_candidate_id
    AND "position" IS NULL;

  -- Notify listeners (payload: candidate_id)
  PERFORM pg_notify('channel_enem_score', v_candidate_id::text);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) Trigger: on INSERT/UPDATE of EnemScore
DROP TRIGGER IF EXISTS trg_notify_enem_event ON "EnemScore";
CREATE TRIGGER trg_notify_enem_event
AFTER INSERT OR UPDATE ON "EnemScore"
FOR EACH ROW
EXECUTE FUNCTION public.fn_notify_enem_event();
