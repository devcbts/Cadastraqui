-- Active: 1715349114916@@monorail.proxy.rlwy.net@12943@railway

CREATE OR REPLACE FUNCTION notify_event() RETURNS TRIGGER AS $$
DECLARE
BEGIN
  PERFORM pg_notify('channel_housing', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER your_trigger
AFTER INSERT OR UPDATE ON "housing"
FOR EACH ROW EXECUTE PROCEDURE notify_event();