import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import csv from 'csv-parser';
import fs from 'fs';
import pump from "pump";
import tmp from 'tmp';

export default async function uploadCSVFileToAnnouncement(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user_id = request.user.sub;
        const entity = await prisma.entity.findUnique({
            where: {
                user_id
            }
        });
        if (!entity) {
            throw new ForbiddenError();
        }
        const csvFile = await request.file();
        if (!csvFile) {
            throw new ResourceNotFoundError();
        }

        // Create a temporary file
        const tempFile = tmp.fileSync({ postfix: '.csv' });

        // Save the uploaded file to the temporary file
        await new Promise((resolve, reject) => {
            pump(csvFile.file, fs.createWriteStream(tempFile.name), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });

        const results = <any>[];
        fs.createReadStream(tempFile.name)
            .pipe(csv())
            .on('data', (data: any) => {
                // Process the data as needed
                results.push(data);
            })
            .on('end', () => {
                // Do something with the results array
                console.log(results);

                // Delete the temporary file
                fs.unlink(tempFile.name, (err) => {
                    if (err) {
                        console.error('Failed to delete temporary file:', err);
                    }
                });
            });

        return reply.status(203).send({results });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message });
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error.' });
    }
}