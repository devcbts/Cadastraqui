CREATE OR REPLACE FUNCTION audit_log_function() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO "AuditLog"("table", action, new,"user")
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), COALESCE(current_setting('req.userId',true), current_user, 'NOTDEFINED'));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO "AuditLog"("table", action, old, new,"user")
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), COALESCE(current_setting('req.userId',true), current_user, 'NOTDEFINED'));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO "AuditLog"("table", action, old,"user")
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), COALESCE(current_setting('req.userId',true), current_user, 'NOTDEFINED'));
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

-- -- USING PG_NOTIFY INSTEAD OF PURE TRIGGERS

-- CREATE OR REPLACE FUNCTION notify_audit_log() RETURNS TRIGGER AS $$
--         BEGIN 
--             IF TG_OP = 'INSERT' THEN
--                 PERFORM pg_notify('channel_audit',json_build_object('table',TG_TABLE_NAME,'op', TG_OP,'new', row_to_json(NEW))::TEXT);
--                 RETURN NEW;
--             ELSIF TG_OP = 'UPDATE' THEN
--                 PERFORM pg_notify('channel_audit',json_build_object('table',TG_TABLE_NAME,'op', TG_OP,'old',row_to_json(OLD),'new', row_to_json(NEW))::TEXT);
--                 RETURN NEW;
--             ELSIF TG_OP = 'DELETE' THEN
--                 PERFORM pg_notify('channel_audit',json_build_object('table',TG_TABLE_NAME,'op', TG_OP,'old',row_to_json(OLD))::TEXT);
--                 RETURN OLD;
--         	END IF;
--         END;
-- $$ LANGUAGE plpgsql;

-- -- CREATE TRIGGERS
-- DO $$ 
-- DECLARE 
--     r RECORD;
-- BEGIN 
--     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
--     and tablename NOT IN ('AuditLog', 'registration','LoginHistory', 'InterviewSchedule')
--     ) 
--     LOOP 
--         EXECUTE 'CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON "' || r.tablename || '" FOR EACH ROW EXECUTE FUNCTION notify_audit_log()();'; 
--     END LOOP; 
-- END $$;