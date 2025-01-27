import { APIError } from "@/errors/api-error";
import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import getDelimiter from "@/utils/get-csv-delimiter";
import { AllEducationType, AllScholarshipsType, SHIFT } from "@prisma/client";
import chardet from 'chardet';
import csvParser from "csv-parser";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from 'fs';
import { decodeStream, encodeStream } from "iconv-lite";
import pump from "pump";
import tmp from 'tmp';
import { EntityNotExistsErrorWithCNPJ } from '../../../errors/entity-not-exists-with-cnpj';
import { normalizeString } from "./utils/normalize-string";
import SelectEntityOrDirector from "./utils/select-entity-or-director";

interface CSVData {
    "CNPJ (Matriz ou Filial)": string;
    "Tipo de Curso": string;
    "Ciclo/Ano/Série/Curso": string;
    "Turno": string;
    "Tipo de Bolsa": string;
    "Número de Vagas": string;
    "Semestre": string;
}
const educationTypeMapping: { [key: string]: AllEducationType } = {
    "Graduação - Bacharelado": AllEducationType.UndergraduateBachelor,
    "Graduação - Licenciatura": AllEducationType.UndergraduateLicense,
    "Graduação - Tecnólogo": AllEducationType.UndergraduateTechnologist,
    "Pós-Graduação Stricto Sensu": AllEducationType.Postgraduate
};

const shiftMapping: { [key: string]: string } = {
    "Matutino": SHIFT.Matutino,
    "Vespertino": SHIFT.Vespertino,
    "Noturno": SHIFT.Noturno,
    "Integral": SHIFT.Integral
}

const scholarshipTypeMapping: { [key: string]: AllScholarshipsType } = {
    "PROUNI Integral": AllScholarshipsType.PROUNIFull,
    "PROUNI Parcial": AllScholarshipsType.PROUNIPartial,
    "Governo Estadual": AllScholarshipsType.StateGovernment,
    "Governo Municipal": AllScholarshipsType.CityGovernment,
    "Entidades Externas": AllScholarshipsType.ExternalEntities,
    "Instituição de Ensino Superior Parcial": AllScholarshipsType.HigherEduInstitutionPartial,
    "Instituição de Ensino Superior Integral": AllScholarshipsType.HigherEduInstitutionFull,
    "Trabalhadores da Instituição de Ensino Superior": AllScholarshipsType.HigherEduInstitutionWorkers,
    "Pós-Graduação Stricto Sensu": AllScholarshipsType.PostgraduateStrictoSensu
};


export default async function uploadHigherEducationCSVFileToAnnouncement(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user_id = request.user.sub
        const role = request.user.role

        const entity = await SelectEntityOrDirector(user_id, role)
        const csvFile = await request.file();
        if (!csvFile) {
            throw new ResourceNotFoundError();
        }

        // Create a temporary file
        const tempFile = tmp.fileSync({ postfix: '.csv' });
        // Save the uploaded file to the temporary file
        await new Promise((resolve, reject) => {
            const readStream = csvFile.file

            pump(readStream, fs.createWriteStream(tempFile.name), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });

        const encoding = chardet.detectFileSync(tempFile.name)
        const separator = await getDelimiter(tempFile.name)
        console.log(separator)
        // const encoding = detectedEncoding === 'windows-1251' ? 'latin1' : (detectedEncoding as string || 'utf8');
        const results: CSVData[] = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFile.name)
                .pipe(decodeStream(encoding ?? 'utf-8'))
                .pipe(encodeStream('utf-8'))
                .pipe(csvParser({ separator: separator }))
                .on('data', (data: CSVData) => {
                    // Process the data as needed
                    console.log(data)
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
                .on('error', (err: any) => {
                    reject(err);
                });
        });

        console.log(results, results.length)
        const uniqueCNPJs = Array.from(new Set(results.map(result => result["CNPJ (Matriz ou Filial)"])));

        const entities = await Promise.all(uniqueCNPJs.map(async (x) => {
            const cnpj = normalizeString(x)
            let entityOrSubsidiary
            entityOrSubsidiary = await prisma.entity.findUnique({
                where: {
                    normalizedCnpj: cnpj,
                    id: entity.id
                }

            }) || await prisma.entitySubsidiary.findUnique({
                where: {
                    normalizedCnpj: cnpj,
                    entity_id: entity.id
                }
            });
            if (!entityOrSubsidiary) {
                throw new EntityNotExistsErrorWithCNPJ(cnpj);
            }
            console.log('ACHEI', entityOrSubsidiary.CNPJ, entityOrSubsidiary.socialReason)
            return entityOrSubsidiary;
        }))
        if (results.some(e => {
            const value = parseInt(e["Número de Vagas"])
            return isNaN(value) || value <= 0
        })) {
            throw new APIError('Não podem haver vagas iguais à zero.')
        }
        const csvDataFormated = results.map((result: CSVData) => {
            const matchedEntity = entities.find(entity => entity.CNPJ === normalizeString(result["CNPJ (Matriz ou Filial)"]));
            return {
                // cnpj: result["CNPJ (Matriz ou Filial)"],
                type: educationTypeMapping[result["Tipo de Curso"]],
                name: result["Ciclo/Ano/Série/Curso"],
                shift: result["Turno"],
                typeOfScholarship: scholarshipTypeMapping[result["Tipo de Bolsa"]],
                verifiedScholarships: parseInt(result["Número de Vagas"]),
                entity_subsidiary_id: matchedEntity?.id === entity.id ? null : matchedEntity?.id,
                semester: parseInt(result["Semestre"])
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
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof APIError) {
            return reply.status(400).send({ message: error.message });

        }
        console.log(error)
        return reply.status(500).send({ message: 'Internal server error.' });
    }
}