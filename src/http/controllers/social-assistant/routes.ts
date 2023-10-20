import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { registerAssistant } from "./register";
import { getApplications } from "./get-applications";
import { addHistory } from "./add-history";
import { getDocumentsPDF } from "./get-pdf-documents";
import { enrollApplication } from "./enrol-application";
export async function assistantRoutes(app: FastifyInstance){

    app.post('/',{onRequest: [verifyJWT]}, registerAssistant)

    app.get("/:announcement_id/:application_id?", {onRequest: [verifyJWT]}, getApplications)
    app.post("/:announcement_id/:application_id", {onRequest: [verifyJWT]}, enrollApplication)

    app.post("/history/:application_id", {onRequest: [verifyJWT]}, addHistory)

    app.get("/documents/:announcement_id/:application_id", {onRequest: [verifyJWT]}, getDocumentsPDF)
}