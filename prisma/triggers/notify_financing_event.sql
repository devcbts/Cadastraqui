CREATE OR REPLACE FUNCTION notify_financing_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  END IF;

  PERFORM pg_notify('channel_financing', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER financing_trigger
AFTER INSERT OR UPDATE ON "Financing"
FOR EACH ROW EXECUTE PROCEDURE notify_financing_event();