import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { getAwsFile } from "@/lib/S3";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getStudentInformation(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const schema = z.object({
            student_id: z.string()
        })
        const { error, data } = schema.safeParse(request.params)
        if (error) {
            throw new APIError('Id do estudante inválido')
        }
        const { student_id } = data
        const student = await prisma.student.findUnique({
            where: { id: student_id },
            include: {
                candidate: {
                    select: {
                        CPF: true,
                        user_id: true,
                        IdentityDetails: true,
                        responsible_id: true,
                        FamillyMember: true,
                        FamilyMemberIncome: true,
                        Expense: true,
                    }
                },
                entityCourse: { include: { entity: true, entitySubsidiary: true, course: true } },

            }
        })
        let candidate: any = student?.candidate.IdentityDetails ?? null
        let members: any = student?.candidate.FamillyMember
        let incomes = student?.candidate.FamilyMemberIncome
        let expenses = student?.candidate.Expense
        if (student?.candidate.responsible_id) {
            const addressInfo = await prisma.identityDetails.findUnique({
                where: { responsible_id: student.candidate.responsible_id },
                select: {
                    address: true,
                    addressNumber: true,
                    city: true,
                    UF: true,
                    CEP: true,
                    neighborhood: true
                }
            })
            const candidateInformation = await prisma.familyMember.findFirst({
                where: { AND: [{ legalResponsibleId: student.candidate.responsible_id }, { CPF: student.candidate.CPF }] }
            })
            candidate = candidateInformation ? { ...candidateInformation, ...addressInfo } : null
            const responsible = await prisma.legalResponsible.findUnique({
                where: { id: student.candidate.responsible_id },
                select: {
                    FamillyMember: true, FamilyMemberIncome: true, Expense: true,
                    IdentityDetails: true
                }
            })
            members = responsible?.FamillyMember.filter((e: any) => e.CPF !== student.candidate.CPF)
            members.push(responsible?.IdentityDetails)
            incomes = responsible?.FamilyMemberIncome
            expenses = responsible?.Expense
        }

        const documents = await prisma.candidateDocuments.findMany({
            where: { memberId: { in: [student?.candidate_id ?? "", student?.candidate.responsible_id ?? ""].concat(members?.map((e: any) => e.id) ?? []) } },
            select: { status: true, updatedAt: true }
        })
        console.log(documents)
        if (!candidate) {
            throw new APIError('Dados do estudante não encontrados')
        }
        const photo = await getAwsFile(`ProfilePictures/${student?.candidate.user_id}`)
        const url = photo.fileUrl
        const personalInfo = {
            name: candidate?.fullName,
            socialName: candidate.socialName,
            phone: candidate.landlinePhone,
            email: candidate.email,
            gender: candidate.gender,
            address: `${candidate.address},${candidate.neighborhood} Nº ${candidate.addressNumber}. ${candidate.city} - ${candidate.UF}`,
            CPF: candidate.CPF,
            birthDate: candidate.birthDate,
            RG: candidate.RG,
            candidate_id: student?.candidate.responsible_id ?? student?.candidate_id
        }
        const courseInfo = {
            scholarship: student?.scholarshipType,
            entity: student?.entityCourse.entity?.socialReason ?? student?.entityCourse.entitySubsidiary?.socialReason,
            course: student?.entityCourse.course.name,
            shift: student?.shift,
            modality: student?.educationStyle,
            status: student?.status
        }
        const scholarshipInfo = {
            isPartial: student?.isPartial,
            admission: student?.admissionDate,
            scholarshipType: student?.scholarshipType,
            scholarshipStatus: student?.scholarshipStatus,
            renewStatus: student?.renewStatus,

        }
        const documentInfo = {
            isUpdated: documents.length === 0 ? null : (documents.every(e => e.status === "UPDATED")),
            lastUpdate: documents.sort((a, b) => a.updatedAt > b.updatedAt ? 1 : -1)[0]?.updatedAt ?? ''
        }
        const incomeInfo = {
            expenses: expenses?.reduce((acc, curr) => acc += curr.totalExpense ?? 0, 0),
            status: (incomes?.length === 0 || incomes?.some(e => e.isUpdated === null)) ? null : (incomes?.every(e => e.isUpdated)),
            averageIncome: (incomes?.reduce((acc, curr) => {
                acc += Number(curr.averageIncome)
                return acc
            }, 0) ?? 0) / (members.length + 1)
        }
        const familyInfo = members
        return response.status(200).send({
            scholarshipInfo,
            documentInfo,
            personalInfo,
            courseInfo,
            familyInfo,
            incomeInfo,
            url,
        })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        console.log(err)
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}