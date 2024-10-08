import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getAllCourses(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const courses = await prisma.course.findMany()
        return response.status(200).send({ courses })
    } catch (err) {
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }

}