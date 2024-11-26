CREATE OR REPLACE FUNCTION notify_finished_registration_event() RETURNS TRIGGER AS $$
DECLARE
  operation text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    operation := 'Insert';
  ELSIF (TG_OP = 'UPDATE') THEN
    operation := 'Update';
  ELSIF (TG_OP = 'DELETE') THEN
    operation := 'Delete';
    -- Para operações DELETE, use OLD para obter os dados antes da exclusão
    PERFORM pg_notify('channel_finished_registration', json_build_object('operation', operation, 'data', row_to_json(OLD))::text);
    RETURN OLD; -- Retorna OLD para operação DELETE
  END IF;

  -- Para INSERT e UPDATE, use NEW para obter os dados após a operação
  PERFORM pg_notify('channel_finished_registration', json_build_object('operation', operation, 'data', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER finished_registration_trigger
AFTER INSERT OR UPDATE OR DELETE ON "registration"
FOR EACH ROW EXECUTE PROCEDURE notify_finished_registration_event();