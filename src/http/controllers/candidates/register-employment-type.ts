import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'



const EmploymentType = z.enum([
    'PrivateEmployee',
    'PublicEmployee',
    'DomesticEmployee',
    'TemporaryRuralEmployee',
    'BusinessOwnerSimplifiedTax',
    'BusinessOwner',
    'IndividualEntrepreneur',
    'SelfEmployed',
    'Retired',
    'Pensioner',
    'Apprentice',
    'Volunteer',
    'RentalIncome',
    'Student',
    'InformalWorker',
    'Unemployed',
    'TemporaryDisabilityBenefit',
    'LiberalProfessional',
    'FinancialHelpFromOthers',
    'Alimony',
    'PrivatePension',
])

const EmploymentTypeSchema = z.object({
    employmentType: EmploymentType,
    quantity: z.number().default(3),
    startDate: z.string().optional(),
    fantasyName: z.string().optional(),
    CNPJ: z.string().optional(),
    socialReason: z.string().optional(),
    financialAssistantCPF: z.string().optional(),
    admissionDate: z.string().optional(),
    position: z.string().optional(),
    payingSource: z.string().optional(),
    payingSourcePhone: z.string().optional(),
    receivesUnemployment: z.boolean().optional(),
    parcels: z.number().optional(),
    firstParcelDate: z.string().optional(),
    parcelValue: z.number().optional(),
});

export async function registerEmploymenType(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const ParamsSchema = z.object({
        _id: z.string(),
    })

    const { _id } = ParamsSchema.parse(request.params)

    const {
        quantity,
        employmentType,
        startDate,
        fantasyName,
        CNPJ,
        socialReason,
        financialAssistantCPF,
        admissionDate,
        position,
        payingSource,
        payingSourcePhone,
        receivesUnemployment,
        parcels,
        firstParcelDate,
        parcelValue
    } = EmploymentTypeSchema.parse(request.body)

    try {
        const user_id = request.user.sub

        const candidate = await prisma.candidate.findUnique({ where: { user_id }, include: { FamillyMember: true } })
        if (!candidate) {
            throw new ResourceNotFoundError()
        }

        const isCandidate = await prisma.candidate.findUnique({
            where: { id: _id }
        })

        const idField = isCandidate ? { candidate_id: _id } : { familyMember_id: _id };

        await prisma.familyMemberIncome.deleteMany({
            where: { ...idField, employmentType: employmentType }
        })
        const monthlyIncomes = await prisma.monthlyIncome.findMany({
            where: idField,
        })

        const validIncomes = monthlyIncomes.filter(income => income.liquidAmount !== null && income.liquidAmount > 0);
        const totalAmount = validIncomes.reduce((acc, current) => {
            return acc + (current.liquidAmount || 0);
        }, 0);

        const avgIncome = validIncomes.length > 0 ? totalAmount / quantity : 0;
        console.log(avgIncome)
        await prisma.familyMemberIncome.deleteMany({
            where: { ...idField, employmentType: employmentType }
        })
        await prisma.familyMemberIncome.create({
            data: {
                employmentType,
                averageIncome: avgIncome.toString(),
                startDate: startDate ? new Date(startDate) : undefined,
                fantasyName,
                CNPJ,
                socialReason,
                quantity,
                financialAssistantCPF,
                admissionDate: admissionDate ? new Date(admissionDate) : undefined,
                position,
                payingSource,
                payingSourcePhone,
                receivesUnemployment,
                parcels,
                firstParcelDate: firstParcelDate ? new Date(firstParcelDate) : undefined,
                parcelValue,
                ...idField
            },
        })
        const applications = await prisma.application.findMany({
            where: { candidate_id: candidate.id },
            include: {
                announcement: true
            },
        })
        if (applications.length !== 0) {
            applications.forEach(async (application) => {
                if (application.announcement.closeDate! <= new Date()) {

                    await prisma.application.update({
                        where: { id: application.id },
                        data: {

                        }
                    })
                }
            })
        }
        return reply.status(201).send()
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}