import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { NotAllowedError } from '@/errors/not-allowed-error';
import { z } from 'zod';

export async function calculateExpenses(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    candidate_id: z.string(),
  });

  try {
    const { candidate_id } = fetchParamsSchema.parse(request.params);

    // Buscar todos os membros da família associados ao candidato
    const familyMembers = await prisma.familyMember.findMany({
      where: { candidate_id: candidate_id }
    });

    
    const monthlyExpenses = await prisma.expense.findMany({
      where: {candidate_id: candidate_id}
    })
    let grandTotal = monthlyExpenses.reduce((acc,curr) => acc + (curr.totalExpense ?? 0), 0)/monthlyExpenses.length;

    // Calcular despesas para cada membro da família
    for (const member of familyMembers) {
      const familyMember_id = member.id;

      

      const loans = await prisma.loan.findMany({
        where: { familyMember_id: familyMember_id }
      });
      const financings = await prisma.financing.findMany({
        where: { familyMember_id: familyMember_id }
      });
      const creditCards = await prisma.creditCard.findMany({
        where: { familyMember_id: familyMember_id }
      });
      const otherExpenses = await prisma.otherExpense.findMany({
        where: { familyMember_id: familyMember_id }
      });

      const totalLoan = loans.reduce((acc, curr) => acc + (curr.installmentValue ?? 0), 0);
      const totalFinancing = financings.reduce((acc, curr) => acc + (curr.installmentValue ?? 0), 0);
      const totalCreditCard = creditCards.reduce((acc, curr) => acc + (curr.invoiceValue ?? 0), 0);
      const totalOtherExpense = otherExpenses.reduce((acc, curr) => acc + (curr.value ?? 0), 0);

      grandTotal += totalLoan + totalFinancing + totalCreditCard + totalOtherExpense;
    }

    // Não é necessário buscar despesas na tabela 'expense' separadamente, pois essas já estão incluídas nas outras tabelas
    return reply.status(200).send({ grandTotal });
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message });
    }
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
