-- Active: 1715349114916@@monorail.proxy.rlwy.net@12943@railway
CREATE OR REPLACE FUNCTION notify_bankaccount_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  ELSIF (TG_OP = 'DELETE') THEN
    operation := 'Delete';
    -- For DELETE operation, use OLD instead of NEW to get the row data before deletion
    PERFORM pg_notify('channel_bankaccount', json_build_object('operation', operation, 'data', row_to_json(OLD))::text);
    RETURN OLD; -- Return OLD for DELETE operation
  END IF;

  PERFORM pg_notify('channel_bankaccount', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER bankaccount_trigger
AFTER INSERT OR UPDATE OR DELETE ON "BankAccount"
FOR EACH ROW EXECUTE PROCEDURE notify_bankaccount_event();