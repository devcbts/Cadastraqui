import { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import updateSign from "./update-sign";

export async function signatureRoutes(app: FastifyInstance) {
    // for this specific routing, we need to allow every endpoint connection (webhook use)
    app.register(fastifyCors, {
        origin: '*',
        methods: ['POST']
    });
    app.post('/update-sign', updateSign)
}
