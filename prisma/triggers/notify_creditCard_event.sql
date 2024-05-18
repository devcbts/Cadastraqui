-- Active: 1715349114916@@monorail.proxy.rlwy.net@12943@railway
CREATE OR REPLACE FUNCTION notify_creditCard_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  END IF;

  PERFORM pg_notify('channel_creditCard', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creditCard_trigger
AFTER INSERT OR UPDATE ON "CreditCard"
FOR EACH ROW EXECUTE PROCEDURE notify_creditCard_event();