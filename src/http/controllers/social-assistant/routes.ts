import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { registerAssistant } from "./register";
import { getApplications } from "./get-applications";
import { addHistory } from "./add-history";
export async function assistantRoutes(app: FastifyInstance){

    app.post('/',{onRequest: [verifyJWT]}, registerAssistant)

    app.get("/:announcement_id/:application_id?", {onRequest: [verifyJWT]}, getApplications)

    app.post("/history/:application_id", {onRequest: [verifyJWT]}, addHistory)
}