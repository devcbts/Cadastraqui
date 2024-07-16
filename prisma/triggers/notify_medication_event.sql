CREATE OR REPLACE FUNCTION notify_medication_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  ELSIF (TG_OP = 'DELETE') THEN
    operation := 'Delete';
    PERFORM pg_notify('channel_medication', json_build_object('operation', operation, 'data', row_to_json(OLD))::text);
    RETURN OLD;
  END IF;

  PERFORM pg_notify('channel_medication', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER medication_trigger
AFTER INSERT OR UPDATE OR DELETE ON "medications"
FOR EACH ROW EXECUTE PROCEDURE notify_medication_event();