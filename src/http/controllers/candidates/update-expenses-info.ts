import { ForbiddenError } from '@/errors/forbidden-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';



export async function updateExpensesInfo(request: FastifyRequest, reply: FastifyReply) {
    const ExpensesUpdateSchema = z.object({
        id: z.string(), // Identificador único da despesa
        month: z.string(),
        waterSewage: z.optional(z.number()).nullable(),
        electricity: z.optional(z.number()).nullable(),
        landlinePhone: z.optional(z.number()).nullable(),
        mobilePhone: z.optional(z.number()).nullable(),
        food: z.optional(z.number()).nullable(),
        rent: z.optional(z.number()).nullable(),
        garageRent: z.optional(z.number()).nullable(),
        condominium: z.optional(z.number()).nullable(),
        cableTV: z.optional(z.number()).nullable(),
        streamingServices: z.optional(z.number()).nullable(),
        fuel: z.optional(z.number()).nullable(),
        annualIPVA: z.optional(z.number()).nullable(),
        optedForInstallmentIPVA: z.optional(z.boolean()).nullable(),
        installmentCountIPVA: z.optional(z.number()).nullable(),
        installmentValueIPVA: z.optional(z.number()).nullable(),
        annualIPTU: z.optional(z.number()).nullable(),
        optedForInstallmentIPTU: z.optional(z.boolean()).nullable(),
        installmentCountIPTU: z.optional(z.number()).nullable(),
        installmentValueIPTU: z.optional(z.number()).nullable(),
        annualITR: z.optional(z.number()).nullable(),
        optedForInstallmentITR: z.optional(z.boolean()).nullable(),
        installmentCountITR: z.optional(z.number()).nullable(),
        installmentValueITR: z.optional(z.number()).nullable(),
        annualIR: z.optional(z.number()).nullable(),
        optedForInstallmentIR: z.optional(z.boolean()).nullable(),
        installmentCountIR: z.optional(z.number()).nullable(),
        installmentValueIR: z.optional(z.number()).nullable(),
        INSS: z.optional(z.number()).nullable(),
        publicTransport: z.optional(z.number()).nullable(),
        schoolTransport: z.optional(z.number()).nullable(),
        internet: z.optional(z.number()).nullable(),
        courses: z.optional(z.number()).nullable(),
        healthPlan: z.optional(z.number()).nullable(),
        dentalPlan: z.optional(z.number()).nullable(),
        medicationExpenses: z.optional(z.number()).nullable(),
        financing: z.optional(z.number()).nullable(),
        creditCard: z.optional(z.number()).nullable(),
        otherExpensesValue: z.optional(z.array(z.number())),
        otherExpensesDescription: z.optional(z.array(z.string())),
        totalExpense: z.optional(z.number()).nullable(),
    });

    const validatedData = ExpensesUpdateSchema.parse(request.body);

    try {
        const user_id = request.user.sub;
        const candidateOrReponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrReponsible) {
            throw new ForbiddenError();
        }

        // Verifica se a despesa existe e está associada ao candidato antes de atualizar
        const existingExpense = await prisma.expense.findUnique({
            where: { id: validatedData.id },
        });

      

        // Atualiza as informações de despesas
        await prisma.expense.update({
            where: { id: validatedData.id },
            data: validatedData,
        });

        return reply.status(200).send({ message: 'Informações de despesas atualizadas com sucesso.' });
    } catch (err: any) {
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message });
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message });
        }
        // Outros tratamentos de erro conforme necessário
        return reply.status(500).send({ message: 'Erro ao atualizar informações de despesas.', error: err.message });
    }
}
