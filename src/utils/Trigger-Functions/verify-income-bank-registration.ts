import { DocumentAnalysisStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { calculateAge } from "../calculate-age";
import { SelectCandidateResponsible } from "../select-candidate-responsible";

export async function verifyIncomeBankRegistration(id: string) {
    // Verificar se o ID pertence a um familyMember
    const familyMember = await prisma.familyMember.findUnique({
        where: { id }
    });

    let idField;
    let isResponsible = false;

    if (familyMember) {
        idField = { familyMember_id: id };
    } else {
        // Verificar se o ID pertence a um candidateOrResponsible
        const candidateOrResponsible = await SelectCandidateResponsible(id);

        if (!candidateOrResponsible) {
            return null;
        }

        idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: id } : { candidate_id: id };
        isResponsible = candidateOrResponsible.IsResponsible;
    }

  let updatedStatus : DocumentAnalysisStatus = 'Approved'

    let update;
    update = true;
    if (familyMember) {
        const hasIncome = await prisma.familyMemberIncome.findMany({
            where: {
                familyMember_id: familyMember.id
            }
        });
        if (hasIncome.some(income => income.isUpdated === false) || hasIncome.length === 0) {
            update = false;
        }
        if (hasIncome.some(income => income.updatedStatus === 'Forced')) {
            updatedStatus = 'Forced'
        }
        if (hasIncome.some(income => income.updatedStatus === 'Declined')) {
            update= false;
            updatedStatus = 'Declined'
        }

        if (familyMember.hasBankAccount) {
            const hasBankAccount = await prisma.bankAccount.findMany({
                where: {
                    familyMember_id: familyMember.id
                }
            });
            if (hasBankAccount.some(bankAccount => bankAccount.isUpdated === false)) {
                update = false;
            }
        }


        if (calculateAge(familyMember.birthDate) >= 18) {
            const pix = await prisma.candidateDocuments.findFirst({
                where: {
                    tableName: 'pix',
                    tableId: familyMember.id
                }
            })
            const registrato = await prisma.candidateDocuments.findFirst({
                where: {
                    tableName: 'registrato',
                    tableId: familyMember.id
                }
            })
            if (pix?.status === 'PENDING' || registrato?.status === 'PENDING') {
                update = false;
            }
            if (!pix || !registrato) {
                update = null;
            }
        }
        if (familyMember.hasBankAccount === null) {
            update = null;
        }
        if (hasIncome.length === 0) {
            update = null;
        }

        await prisma.familyMember.update({
            where: {
                id
            },
            data: {
                isIncomeUpdated: update,
                incomeUpdatedStatus: updatedStatus

            }
        })
    } else {
        const identityDetails = await prisma.identityDetails.findFirst({
            where: {
                OR: [
                    { candidate_id: id },
                    { responsible_id: id }
                ]
            }
        });

        if (!identityDetails) {
            return null;
        }
        const hasIncome = await prisma.familyMemberIncome.findMany({
            where: {
                ...idField
            }
        });
        if (hasIncome.some(income => income.isUpdated === false)) update = false;

        if (hasIncome.length === 0) update = null;


        if (identityDetails.hasBankAccount) {
            const hasBankAccount = await prisma.bankAccount.findMany({
                where: {
                    ...idField
                }
            });
            if (hasBankAccount.some(bankAccount => bankAccount.isUpdated === false)) {
                update = false;
            }
        }


        // faz a busca dos documentos de pix e registrato
        const pix = await prisma.candidateDocuments.findFirst({
            where: {
                tableName: 'pix',
                tableId: id
            }
        })
        const registrato = await prisma.candidateDocuments.findFirst({
            where: {
                tableName: 'registrato',
                tableId: id
            }
        })
        if (pix?.status === 'PENDING' || registrato?.status === 'PENDING') {
            update = false;
        }
        if (!pix || !registrato) {
            update = null;
        }

        if (identityDetails.hasBankAccount === null) {
            update = null;
        }
        if (!hasIncome) {
            update = null;
        }
        await prisma.identityDetails.update({
            where: {
                id: identityDetails.id
            },
            data: {
                isIncomeUpdated: update,
                incomeUpdatedStatus: updatedStatus
            }   
        })


    }


}