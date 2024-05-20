CREATE OR REPLACE FUNCTION notify_application_event() RETURNS TRIGGER AS $$
DECLARE
BEGIN
  PERFORM pg_notify('channel_application', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER application_trigger
AFTER INSERT ON "Application"
FOR EACH ROW EXECUTE PROCEDURE notify_application_event();