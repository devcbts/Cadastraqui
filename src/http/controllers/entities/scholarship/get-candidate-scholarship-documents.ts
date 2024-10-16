import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { getAwsFile } from "@/lib/S3";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getDocumentsUrls } from "../../social-assistant/get-candidate-resume";
const section = ['identity',
    'housing',
    'family-member',
    'monthly-income',
    'income',
    'bank',
    'registrato',
    'statement',
    'health',
    'medication',
    'vehicle',
    'expenses',
    'loan',
    'financing',
    'credit-card',
    'declaracoes']
export default async function getCandidateScholarshipDocuments(request: FastifyRequest, reply: FastifyReply) {
    const candidateParams = z.object({
        scholarship_id: z.string()
    })

    const { scholarship_id } = candidateParams.parse(request.params)
    try {
        const user_id = request.user.sub;

        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id },
            include: {
                application: true
            }
        })

        if (!scholarship) {
            throw new ResourceNotFoundError()

        }

        const application = scholarship.application
        const documentsUrls = await getDocumentsUrls(section, application.id)

        const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application.id)
        if (!candidateOrResponsibleHDB) {
            throw new ResourceNotFoundError()
        }

        const identityDetails = await historyDatabase.identityDetails.findUnique({
            where: { application_id: application.id }
        })
        if (!identityDetails) {
            throw new ResourceNotFoundError()
        }
        const familyMembers = await historyDatabase.familyMember.findMany({
            where: { application_id: application.id }
        })



        const membersNames = familyMembers.map((member) => {
            return {

                id: member.id,
                name: member.fullName
            }
        }
        )

        membersNames.push({ id: candidateOrResponsibleHDB.UserData.id, name: identityDetails.fullName })

        const documentsFilteredByMember = await Promise.all(membersNames.map(async member => {
            const documents = await historyDatabase.candidateDocuments.findMany({
                where: { AND: [{ memberId: member.id }, { application_id: application.id }] }
            })
            const mappedDocs = await Promise.all(documents.map(async doc => {
                const url = await getAwsFile(doc.path)
                return ({ ...doc, url: url.fileUrl })
            }))
            // const groupedDocuments: { [key: string]: { [fileName: string]: string[] } } = {};

            // documentsUrls.forEach((sectionUrls) => {
            //     Object.entries(sectionUrls).forEach(([section, urls]) => {
            //         Object.entries(urls).forEach(([path, fileName]) => {
            //             const parts = path.split('/');
            //             if (parts[3] === member.id) {
            //                 if (!groupedDocuments[section]) {
            //                     groupedDocuments[section] = {};
            //                 }
            //                 Object.entries(fileName).forEach(([Name, url]) => {

            //                     if (!groupedDocuments[section][Name]) {
            //                         groupedDocuments[section][Name] = [];
            //                     }
            //                     groupedDocuments[section][Name].push(url);
            //                 })
            //             }
            //         });
            //     });

            // });
            return { member: member.name, documents: mappedDocs };
        }))

        return reply.status(200).send({ documents: documentsFilteredByMember })
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}