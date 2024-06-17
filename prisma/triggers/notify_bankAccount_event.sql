CREATE OR REPLACE FUNCTION notify_bankaccount_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  END IF;

  PERFORM pg_notify('channel_bankaccount', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bankaccount_trigger
AFTER INSERT OR UPDATE ON "BankAccount"
FOR EACH ROW EXECUTE PROCEDURE notify_bankaccount_event();