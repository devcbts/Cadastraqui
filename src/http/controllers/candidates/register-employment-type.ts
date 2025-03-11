import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import IncomeSource from './enums/IncomeSource'




const EmploymentTypeSchema = z.object({
    employmentType: IncomeSource, // IncomeSource and EmploymentType are the same enum
    quantity: z.number().default(3),
    startDate: z.string().nullish(),
    fantasyName: z.string().nullish(),
    CNPJ: z.string().nullish(),
    socialReason: z.string().nullish(),
    financialAssistantCPF: z.string().transform(e => e.replace(/\D*/g, '')).nullish(),
    admissionDate: z.string().nullish(),
    position: z.string().nullish(),
    payingSource: z.string().nullish(),
    payingSourcePhone: z.string().nullish(),
    receivesUnemployment: z.boolean().nullish(),
    parcels: z.number().nullish(),
    firstParcelDate: z.string().nullish(),
    parcelValue: z.number().nullish(),
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
        const candidate = await SelectCandidateResponsible(_id)
        // const candidate = await prisma.candidate.findUnique({ where: { user_id }, include: { FamillyMember: true } })
        // if (!candidate) {
        //     throw new ResourceNotFoundError()
        // }
        console.log(candidate)
        const isCandidate = candidate !== null
        console.log(isCandidate)
        const idField = isCandidate ? (candidate.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : { familyMember_id: _id };

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

        const { id } = await prisma.familyMemberIncome.create({
            data: {
                employmentType,
                averageIncome: avgIncome.toString(),
                isUpdated: true,
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

        return reply.status(201).send({ id })
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