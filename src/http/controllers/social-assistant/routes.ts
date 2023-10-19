import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { registerAssistant } from "./register";
export async function assistantRoutes(app: FastifyInstance){
    app.post('/',{onRequest: [verifyJWT]}, registerAssistant)
}