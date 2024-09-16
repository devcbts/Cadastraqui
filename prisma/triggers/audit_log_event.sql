CREATE OR REPLACE FUNCTION audit_log_function() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO "AuditLog"("table", action, new)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO "AuditLog"("table", action, old, new)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO "AuditLog"("table", action, old)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;
-- CREATE TRIGGERS
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    and tablename NOT IN ('AuditLog', 'registration','LoginHistory', 'InterviewSchedule')
    ) 
    LOOP 
        EXECUTE 'CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON "' || r.tablename || '" FOR EACH ROW EXECUTE FUNCTION audit_log_function();'; 
    END LOOP; 
END $$;

-- REMOVE ALL TRIGGERS
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    and tablename NOT IN ('AuditLog', 'registration','LoginHistory', 'InterviewSchedule')
    ) 
    LOOP 
        EXECUTE 'DROP TRIGGER audit_trigger ON "' || r.tablename || '" ' ; 
    END LOOP; 
END $$;