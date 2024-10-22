import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import getCandidateSubscriptionDocuments from "./get-documents";

export default async function subscriptionRoutes(app: FastifyInstance) {
    app.get('/documents/:candidate_id', { onRequest: [verifyJWT] }, getCandidateSubscriptionDocuments)
}