import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import getAnnouncementResume from "./get-announcement-resume";
import { getEntityDocuments } from "./get-entity-documents";
import getExpiringDocuments from "./get-expiring-documents";
import getLegalMonthlyReportResume from "./get-monthly-report-resume";
import updateEntityDocument from "./update-entity-document";
import { uploadEntityDocument } from "./upload-entity-document";

export default function entityDocumentsRoutes(app: FastifyInstance) {
    app.get('/legal/documents/:type', { onRequest: verifyJWT }, getEntityDocuments)
    app.post('/legal/documents/:groupId?', { onRequest: verifyJWT }, uploadEntityDocument)
    app.put('/legal/documents/:id', { onRequest: verifyJWT }, updateEntityDocument)
    app.get('/legal/resume/:id', { onRequest: verifyJWT }, getAnnouncementResume)
    app.get('/legal/report', { onRequest: verifyJWT }, getLegalMonthlyReportResume)
    app.get('/legal/expiring', { onRequest: verifyJWT }, getExpiringDocuments)
}