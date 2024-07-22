import { FastifyInstance } from "fastify";
import updateSign from "./update-sign";

export async function signatureRoutes(app: FastifyInstance) {
    app.post('/update-sign', updateSign)
}
