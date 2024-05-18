CREATE OR REPLACE FUNCTION notify_monthlyIncome_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  END IF;

  PERFORM pg_notify('channel_monthlyIncome', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER monthlyIncome_trigger
AFTER INSERT OR UPDATE ON "MonthlyIncome"
FOR EACH ROW EXECUTE PROCEDURE notify_monthlyIncome_event();