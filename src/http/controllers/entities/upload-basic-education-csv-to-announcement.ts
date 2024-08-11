import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import csv from 'csv-parser';
import fs, { cp } from 'fs';
import pump from "pump";
import tmp from 'tmp';
import { BasicEducationType, ScholarshipOfferType, SHIFT } from "@prisma/client";
import { EntityNotExistsError } from "@/errors/entity-not-exists-error";
import { EntityNotExistsErrorWithCNPJ } from '../../../errors/entity-not-exists-with-cnpj';


interface CSVData {
    "CNPJ (Matriz ou Filial)": string;
    "Tipo de Educação": string;
    "Ciclo/Ano/Série/Curso": string;
    "Turno": string;
    "Tipo de Bolsa": string;
    "Número de Vagas": string;
}
const educationTypeMapping: { [key: string]: string } = {
    "Pré-Escola": BasicEducationType.Preschool,
    "Fundamental I e II": BasicEducationType.Elementary,
    "Ensino Médio": BasicEducationType.HighSchool,
    "Educação Profissional": BasicEducationType.ProfessionalEducation
};

const shiftMapping: { [key: string]: string } = {
    "Matutino": SHIFT.Matutino,
    "Vespertino": SHIFT.Vespertino,
    "Noturno": SHIFT.Noturno,
    "Integral": SHIFT.Integral
}

const scholarshipTypeMapping: { [key: string]: ScholarshipOfferType } = {
    "Bolsa Parcial Lei 187": ScholarshipOfferType.Law187ScholarshipPartial,
    "Bolsa Integral Lei 187": ScholarshipOfferType.Law187Scholarship,
    "Estudante com Deficiência Parcial": ScholarshipOfferType.StudentWithDisabilityPartial,
    "Estudante com Deficiência Integral": ScholarshipOfferType.StudentWithDisability,
    "Bolsa Parcial (Integral)": ScholarshipOfferType.FullTimePartial,
    "Bolsa Integral (Integral)": ScholarshipOfferType.FullTime,
    "Trabalhadores da Entidade Parcial": ScholarshipOfferType.EntityWorkersPartial,
    "Trabalhadores da Entidade Integral": ScholarshipOfferType.EntityWorkers
};
export default async function uploadBasicEducationCSVFileToAnnouncement(
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

        const results: CSVData[] = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFile.name)
                .pipe(csv())
                .on('data', (data: CSVData) => {
                    // Process the data as needed
                    results.push(data);
                })
                .on('end', () => {
                    // Delete the temporary file
                    fs.unlink(tempFile.name, (err) => {
                        if (err) {
                            console.error('Failed to delete temporary file:', err);
                        }
                    });
                    resolve(null);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });


        const uniqueCNPJs = Array.from(new Set(results.map(result => result["CNPJ (Matriz ou Filial)"])));

        const entities = await  Promise.all(uniqueCNPJs.map(async (cnpj) => {
            let entityOrSubsidiary

            entityOrSubsidiary = await prisma.entity.findUnique({
                where: {
                    CNPJ: cnpj,
                    id: entity.id
                }
                
            }) || await prisma.entitySubsidiary.findUnique({
                where: {
                    CNPJ: cnpj,
                    entity_id: entity.id
                }
            });
            if (!entityOrSubsidiary) {
                throw new EntityNotExistsErrorWithCNPJ(cnpj);
            }
            return entityOrSubsidiary;
        }))
    

    const csvDataFormated = results.map((result: CSVData) => {
        const matchedEntity = entities.find(entity => entity.CNPJ === result["CNPJ (Matriz ou Filial)"]);
        return {
            cnpj: result["CNPJ (Matriz ou Filial)"],
            basicEdutype: educationTypeMapping[result["Tipo de Educação"]],
            availableCourses: result["Ciclo/Ano/Série/Curso"],
            shift: result["Turno"],
            scholarshipType: scholarshipTypeMapping[result["Tipo de Bolsa"]],
            verifiedScholarships: result["Número de Vagas"],
            entity_id: matchedEntity?.id
        };
    });

    return reply.status(200).send({ csvDataFormated });

} catch (error) {
    if (error instanceof ForbiddenError) {
        return reply.status(403).send({ message: error.message });
    }
    if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: error.message });
    }
    if (error instanceof EntityNotExistsErrorWithCNPJ) {
        return reply.status(404).send({ message: error.message});
    }
    return reply.status(500).send({ message: 'Internal server error.' });
}
}