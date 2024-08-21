import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import IncomeSource from "./enums/IncomeSource";

export default async function updateMonthlyIncome(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        id: z.string().nullish(),
        // IncomeSource: IncomeSource,
        quantity: z.number().default(0),
        incomeSource: IncomeSource,
        startDate: z.string().nullish(),
        fantasyName: z.string().nullish(),
        CNPJ: z.string().nullish(),
        socialReason: z.string().nullish(),
        financialAssistantCPF: z.string().nullish(),
        admissionDate: z.string().nullish(),
        position: z.string().nullish(),
        payingSource: z.string().nullish(),
        payingSourcePhone: z.string().nullish(),
        receivesUnemployment: z.boolean().nullish(),
        parcels: z.number().nullish(),
        firstParcelDate: z.string().nullish(),
        parcelValue: z.number().nullish(),
        incomes: z.array(z.object({
            receivedIncome: z.boolean().default(true),
            id: z.string().optional(),
            date: z.date().or(z.string().transform(v => new Date(v))).default(new Date()),
            grossAmount: z.number().default(0),
            proLabore: z.number().default(0),
            dividends: z.number().default(0),
            deductionValue: z.number().default(0),
            publicPension: z.number().default(0),
            incomeTax: z.number().default(0),
            otherDeductions: z.number().default(0),
            foodAllowanceValue: z.number().default(0),
            transportAllowanceValue: z.number().default(0),
            expenseReimbursementValue: z.number().default(0),
            advancePaymentValue: z.number().default(0),
            reversalValue: z.number().default(0),
            compensationValue: z.number().default(0),
            judicialPensionValue: z.number().default(0),
            // file_document: z.instanceof(File).nullish()
        })).default([])
    })
    const paramsSchema = z.object({
        id: z.string()
    })
    try {
        const user_id = request.user.sub
        const { id: memberId } = paramsSchema.parse(request.params)
        const { id, incomes, quantity, incomeSource, ...rest } = schema.parse(request.body)
        const isCandidateOrResponsible = await SelectCandidateResponsible(memberId)
        let monthlyIncomesId: string[] = []
        // Verifica se existe um familiar cadastrado com o owner_id
        const idField = isCandidateOrResponsible ? (isCandidateOrResponsible.IsResponsible ? { legalResponsibleId: memberId } : { candidate_id: memberId }) : { familyMember_id: memberId };
        await prisma.$transaction(async (tsPrisma) => {
            await Promise.all(incomes.map(async (income) => {
                if (income.grossAmount) {
                    let liquidAmount =
                        income.grossAmount -
                        income.foodAllowanceValue -
                        income.transportAllowanceValue -
                        income.compensationValue -
                        income.expenseReimbursementValue -
                        income.advancePaymentValue -
                        income.reversalValue -
                        income.judicialPensionValue
                    if (income.proLabore && income.dividends) {
                        liquidAmount = income.proLabore + income.dividends
                    }
                    // Armazena informações acerca da renda mensal no banco de dados
                    if (income.id) {
                        monthlyIncomesId.push(income.id)
                        await tsPrisma.monthlyIncome.update({
                            where: { id: income.id },
                            data: {
                                receivedIncome: income.receivedIncome,
                                grossAmount: income.grossAmount,
                                liquidAmount,
                                date: income.date,
                                advancePaymentValue: income.advancePaymentValue,
                                compensationValue: income.compensationValue,
                                deductionValue: income.deductionValue,
                                expenseReimbursementValue: income.expenseReimbursementValue,
                                incomeTax: income.incomeTax,
                                judicialPensionValue: income.judicialPensionValue,
                                otherDeductions: income.otherDeductions,
                                publicPension: income.publicPension,
                                reversalValue: income.reversalValue,
                                foodAllowanceValue: income.foodAllowanceValue,
                                transportAllowanceValue: income.transportAllowanceValue,
                                dividends: income.dividends,
                                proLabore: income.proLabore,
                            }
                        })
                    } else {
                        const newIncome = await tsPrisma.monthlyIncome.create({
                            data: {
                                receivedIncome: income.receivedIncome,
                                grossAmount: income.grossAmount,
                                liquidAmount,
                                date: income.date,
                                advancePaymentValue: income.advancePaymentValue,
                                compensationValue: income.compensationValue,
                                deductionValue: income.deductionValue,
                                expenseReimbursementValue: income.expenseReimbursementValue,
                                incomeTax: income.incomeTax,
                                judicialPensionValue: income.judicialPensionValue,
                                otherDeductions: income.otherDeductions,
                                publicPension: income.publicPension,
                                reversalValue: income.reversalValue,
                                foodAllowanceValue: income.foodAllowanceValue,
                                transportAllowanceValue: income.transportAllowanceValue,
                                dividends: income.dividends,
                                proLabore: income.proLabore,
                                incomeSource,
                                ...idField
                            }
                        })
                        monthlyIncomesId.push(newIncome.id)

                    }

                } else {
                    const total = (income.dividends || 0) + (income.proLabore || 0)
                    // Armazena informações acerca da renda mensal no banco de dados (Empresário)
                    if (income.id) {
                        monthlyIncomesId.push(income.id)

                        await tsPrisma.monthlyIncome.update({
                            where: { id: income.id },
                            data: {
                                receivedIncome: income.receivedIncome,
                                liquidAmount: total,
                                grossAmount: income.grossAmount,
                                date: income.date,
                                advancePaymentValue: income.advancePaymentValue,
                                compensationValue: income.compensationValue,
                                deductionValue: income.deductionValue,
                                expenseReimbursementValue: income.expenseReimbursementValue,
                                incomeTax: income.incomeTax,
                                judicialPensionValue: income.judicialPensionValue,
                                otherDeductions: income.otherDeductions,
                                publicPension: income.publicPension,
                                proLabore: income.proLabore,
                                dividends: income.dividends,
                                reversalValue: income.reversalValue,
                                foodAllowanceValue: income.foodAllowanceValue,
                                transportAllowanceValue: income.transportAllowanceValue,
                                total,
                            }
                        })
                    } else {
                        const newIncome = await tsPrisma.monthlyIncome.create({
                            data: {
                                ...idField,
                                receivedIncome: income.receivedIncome,
                                incomeSource,
                                liquidAmount: total,
                                grossAmount: income.grossAmount,
                                date: income.date,
                                advancePaymentValue: income.advancePaymentValue,
                                compensationValue: income.compensationValue,
                                deductionValue: income.deductionValue,
                                expenseReimbursementValue: income.expenseReimbursementValue,
                                incomeTax: income.incomeTax,
                                judicialPensionValue: income.judicialPensionValue,
                                otherDeductions: income.otherDeductions,
                                publicPension: income.publicPension,
                                proLabore: income.proLabore,
                                dividends: income.dividends,
                                reversalValue: income.reversalValue,
                                foodAllowanceValue: income.foodAllowanceValue,
                                transportAllowanceValue: income.transportAllowanceValue,
                                total,
                            }
                        })
                        monthlyIncomesId.push(newIncome.id)

                    }

                }
            }))
            const monthlyIncomes = await tsPrisma.monthlyIncome.findMany({
                where: idField,
            })

            const validIncomes = monthlyIncomes.filter(income => income.liquidAmount !== null && income.liquidAmount > 0 && income.receivedIncome === true);
            const totalAmount = validIncomes.reduce((acc, current) => {
                return acc + (current.liquidAmount || 0);
            }, 0);

            const avgIncome = incomes && validIncomes.length > 0 ? (totalAmount / quantity) : 0;
            let income;
            if (id) {
                income = await tsPrisma.familyMemberIncome.update({
                    where: { id },
                    data: {
                        isUpdated: true,
                        startDate: rest.startDate ? new Date(rest.startDate) : undefined,
                        fantasyName: rest.fantasyName,
                        CNPJ: rest.CNPJ,
                        socialReason: rest.socialReason,
                        quantity,
                        financialAssistantCPF: rest.financialAssistantCPF,
                        admissionDate: rest.admissionDate ? new Date(rest.admissionDate) : undefined,
                        position: rest.position,
                        payingSource: rest.payingSource,
                        payingSourcePhone: rest.payingSourcePhone,
                        receivesUnemployment: rest.receivesUnemployment,
                        parcels: rest.parcels,
                        firstParcelDate: rest.firstParcelDate ? new Date(rest.firstParcelDate) : undefined,
                        parcelValue: rest.parcelValue,
                        MonthlyIncomes: {
                            connect: monthlyIncomesId.map(id => ({ id }))
                        }
                    },


                })
            } else {
                income = await tsPrisma.familyMemberIncome.create({
                    data: {
                        ...idField,
                        isUpdated: true,
                        employmentType: incomeSource,
                        averageIncome: avgIncome.toString(),
                        startDate: rest.startDate ? new Date(rest.startDate) : undefined,
                        fantasyName: rest.fantasyName,
                        CNPJ: rest.CNPJ,
                        socialReason: rest.socialReason,
                        quantity,
                        financialAssistantCPF: rest.financialAssistantCPF,
                        admissionDate: rest.admissionDate ? new Date(rest.admissionDate) : undefined,
                        position: rest.position,
                        payingSource: rest.payingSource,
                        payingSourcePhone: rest.payingSourcePhone,
                        receivesUnemployment: rest.receivesUnemployment,
                        parcels: rest.parcels,
                        firstParcelDate: rest.firstParcelDate ? new Date(rest.firstParcelDate) : undefined,
                        parcelValue: rest.parcelValue,
                        MonthlyIncomes: {
                            connect: monthlyIncomesId.map(id => ({ id }))
                        }
                    }

                })

            }

            if (monthlyIncomes?.length >= 6) {
                await tsPrisma.familyMemberIncome.updateMany({
                    where: { AND: [idField, { employmentType: incomeSource }] },
                    data: { isUpdated: true }
                })
            }
            return response.status(200).send({
                incomeId: income.id,
                monthlyIncomesId
            })
        })

    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}