CREATE OR REPLACE FUNCTION notify_familyMemberDisease_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  ELSIF (TG_OP = 'DELETE') THEN
    operation := 'Delete';
    PERFORM pg_notify('channel_familyMemberDisease', json_build_object('operation', operation, 'data', row_to_json(OLD))::text);
    RETURN OLD;
  END IF;

  PERFORM pg_notify('channel_familyMemberDisease', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER familyMemberDisease_trigger
AFTER INSERT OR UPDATE ON "familyMemberDiseases"
FOR EACH ROW EXECUTE PROCEDURE notify_familyMemberDisease_event();