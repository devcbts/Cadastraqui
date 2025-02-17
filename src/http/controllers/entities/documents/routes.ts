import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { getEntityDocuments } from "./get-entity-documents";
import { uploadEntityDocument } from "./upload-entity-document";

export default function entityDocumentsRoutes(app: FastifyInstance) {
    app.get('/legal/documents/:type', { onRequest: verifyJWT }, getEntityDocuments)
    app.post('/legal/documents', { onRequest: verifyJWT }, uploadEntityDocument)
}