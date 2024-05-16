import { env } from "process";

import { Client } from 'pg';
import { prisma, historyDatabase } from './prisma';

// Substitua por suas informações de conexão do PostgreSQL
const clientBackup = new Client({
    user: env.POSTGRES_USER,
    host: env.PGHOST,
    database: env.POSTGRES_DB,
    password: "pLsXyXxwlRiXEvociCeMBURnbVeXbmDa",
    port: Number(env.PGPORT),
});

clientBackup.connect();

clientBackup.query('LISTEN channel_housing');
clientBackup.query('LISTEN channel_application');

clientBackup.on('notification', async (msg) => {
    console.log('Received notification:', msg.payload);


    if (msg.channel == 'channel_application') {
        const application = JSON.parse(msg.payload!);
        const application_id = application.id
        const candidate_id = application.candidate_id

        const findUserDetails = await prisma.candidate.findUnique({
            where: { id: candidate_id }
        })

        const findIdentityDetails = await prisma.identityDetails.findUnique({
            where: { candidate_id }
        })

        const findFamilyMembers = await prisma.familyMember.findMany({
            where: { candidate_id }
        }
        )
        const findHousing = await prisma.housing.findUnique({
            where: { candidate_id }
        });

        const findVehicle = await prisma.vehicle.findMany({
            where: { candidate_id }
        });

        const findFamilyMemberIncome = await prisma.familyMemberIncome.findMany({
            where: { candidate_id }
        });

        const findMonthlyIncome = await prisma.monthlyIncome.findMany({
            where: { candidate_id }
        });

        const findExpense = await prisma.expense.findMany({
            where: { candidate_id }
        });

        const findLoan = await prisma.loan.findMany({
            where: { candidate_id }
        });

        const findFinancing = await prisma.financing.findMany({
            where: { candidate_id }
        });

        const findCreditCard = await prisma.creditCard.findMany({
            where: { candidate_id }
        });

        const findOtherExpense = await prisma.otherExpense.findMany({
            where: { candidate_id }
        });

        const findFamilyMemberDisease = await prisma.familyMemberDisease.findMany({
            where: { candidate_id }
        });

        const findMedication = await prisma.medication.findMany({
            where: { candidate_id }
        });

        const { id: oldCandidateId, ...userDetails } = findUserDetails!;
        const createCandidateDetails = await historyDatabase.candidate.create({
            data: { main_id: oldCandidateId, ...userDetails, application_id }
        });
        const newCandidateId = createCandidateDetails.id;

        // Save the old and new IDs in the IdMapping table
        await historyDatabase.idMapping.create({
            data: { mainId: oldCandidateId, newId: newCandidateId, application_id }
        });

        // ... repeat for the FamilyMember table ...

        for (const familyMember of findFamilyMembers) {
            const { id: oldFamilyMemberId, candidate_id, ...familyMemberData } = familyMember;
            const createFamilyMember = await historyDatabase.familyMember.create({
                data: { main_id: oldFamilyMemberId, candidate_id: newCandidateId, ...familyMemberData, application_id }
            });
            const newFamilyMemberId = createFamilyMember.id;

            // Save the old and new IDs in the IdMapping table
            await historyDatabase.idMapping.create({
                data: { mainId: oldFamilyMemberId, newId: newFamilyMemberId, application_id }
            });
        }
        const { id: identityId, ...identityDetails } = findIdentityDetails!;
        const createIdentityDetails = await historyDatabase.identityDetails.create({
            data: {main_id: identityId, ...identityDetails, application_id }
        });

        const { id, ...housingDetails } = findHousing!;
        const createHousing = await historyDatabase.housing.create({
            data: {main_id:id, ...housingDetails, application_id }
        });


        for (const familyMemberIncome of findFamilyMemberIncome) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...familyMemberIncomeData } = familyMemberIncome;
            // Find the new familyMember_id in the IdMapping table

            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;

            // Find the new candidate_id in the IdMapping table
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            // Create the new FamilyMemberIncome record with the new IDs
            const createFamilyMemberIncome = await historyDatabase.familyMemberIncome.create({
                data: {main_id: familyMemberIncome.id, ...familyMemberIncomeData, application_id, ...idField }
            });
        }

        for (const monthlyIncome of findMonthlyIncome) {
            const { id: oldId, familyMember_id: oldFamilyMemberId,candidate_id: oldCandidateId, ...monthlyIncomeData } = monthlyIncome;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };

            const createMonthlyIncome = await historyDatabase.monthlyIncome.create({
                    data: {main_id:monthlyIncome.id, ...monthlyIncomeData, ...idField, application_id }
            });
        }

        for (const expense of findExpense) {
            const { id: oldId, candidate_id: oldCandidateId, ...expenseData } = expense;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldCandidateId)!, application_id }
            });
            const idField = { candidate_id: newCandidateId };
            const createExpense = await historyDatabase.expense.create({
                data: {main_id: expense.id, ...expenseData, application_id, ...idField }
            });
        }
        for (const loan of findLoan) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...loanData } = loan;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            const createLoan = await historyDatabase.loan.create({
                data: {main_id:loan.id, ...loanData, application_id, ...idField }
            });
        }

        for (const financing of findFinancing) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...financingData } = financing;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            const createFinancing = await historyDatabase.financing.create({
                data: {main_id:financing.id, ...financingData, application_id, ...idField }
            });
        }

        // Para creditCard
        for (const creditCard of findCreditCard) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...creditCardData } = creditCard;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            const createCreditCard = await historyDatabase.creditCard.create({
                data: {main_id:creditCard.id, ...creditCardData, application_id, ...idField }
            });
        }

        // Para otherExpense
        for (const otherExpense of findOtherExpense) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...otherExpenseData } = otherExpense;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            const createOtherExpense = await historyDatabase.otherExpense.create({
                data: { main_id: otherExpense.id,...otherExpenseData, application_id, ...idField }
            });
        }

        // Para familyMemberDisease
        for (const familyMemberDisease of findFamilyMemberDisease) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...familyMemberDiseaseData } = familyMemberDisease;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            const createFamilyMemberDisease = await historyDatabase.familyMemberDisease.create({
                data: {main_id: familyMemberDisease.id, ...familyMemberDiseaseData, application_id, ...idField }
            });
        }

        // Para medication
        for (const medication of findMedication) {
            const { id: oldId, familyMember_id: oldFamilyMemberId, candidate_id: oldCandidateId, ...medicationData } = medication;
            const familyMemberMapping = await historyDatabase.idMapping.findFirst({
                where: { mainId: (oldFamilyMemberId || oldCandidateId)!, application_id }
            });
            const newFamilyMemberId = familyMemberMapping?.newId;
            const idField = oldFamilyMemberId ? { familyMember_id: newFamilyMemberId } : { candidate_id: newCandidateId };
            const createMedication = await historyDatabase.medication.create({
                data: {main_id:medication.id, ...medicationData, application_id, ...idField }
            });
        }

       

    }

});

module.exports = clientBackup;

