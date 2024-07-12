import { env } from "process";

import getOpenApplications from "@/HistDatabaseFunctions/find-open-applications";
import findAllBankAccount from "@/HistDatabaseFunctions/Handle Application/find-all-bank-account";
import findAllCreditCard from "@/HistDatabaseFunctions/Handle Application/find-all-credit-card";
import findAllDiseases from "@/HistDatabaseFunctions/Handle Application/find-all-diseases";
import findAllExpense from "@/HistDatabaseFunctions/Handle Application/find-all-expense";
import findAllFinancing from "@/HistDatabaseFunctions/Handle Application/find-all-financing";
import findAllIncome from "@/HistDatabaseFunctions/Handle Application/find-all-income";
import findAllLoan from "@/HistDatabaseFunctions/Handle Application/find-all-loan";
import findAllMedication from "@/HistDatabaseFunctions/Handle Application/find-all-medication";
import findAllMonthlyIncome from "@/HistDatabaseFunctions/Handle Application/find-all-monthly-income";
import { createBankAccountHDB, deleteBankAccountHDB, updateBankAccountHDB } from "@/HistDatabaseFunctions/handle-bank-account";
import { createCandidateHDB, updateCandidateHDB } from "@/HistDatabaseFunctions/handle-candidate";
import { createCreditCardHDB, updateCreditCardHDB } from "@/HistDatabaseFunctions/handle-credit-card";
import { createDeclarationHDB } from "@/HistDatabaseFunctions/handle-declaration";
import { createExpenseHDB, updateExpenseHDB } from "@/HistDatabaseFunctions/handle-expenses";
import { createFamilyMemberHDB, updateFamilyMemberHDB } from "@/HistDatabaseFunctions/handle-family-member";
import { createFamilyMemberDiseaseHDB, deleteFamilyMemberDiseaseHDB, updateFamilyMemberDiseaseHDB } from "@/HistDatabaseFunctions/handle-family-member-disease";
import { createFamilyMemberIncomeHDB } from "@/HistDatabaseFunctions/handle-family-member-income";
import { createHousingHDB, updateHousingHDB } from "@/HistDatabaseFunctions/handle-housing";
import { createIdentityDetailsHDB, updateIdentityDetailsHDB } from "@/HistDatabaseFunctions/handle-identity-details";
import { createLoanHDB, updateLoanHDB } from "@/HistDatabaseFunctions/handle-loan-info";
import { createMedicationHDB, deleteMedicationHDB, updateMedicationHDB } from "@/HistDatabaseFunctions/handle-medication";
import { createMonthlyIncomeHDB, deleteMonthlyIncomeHDB, updateMonthlyIncomeHDB } from "@/HistDatabaseFunctions/handle-monthly-income";
import { createOtherExpenseHDB, updateOtherExpenseHDB } from "@/HistDatabaseFunctions/handle-other-expense";
import { createRegistratoHDB } from "@/HistDatabaseFunctions/handle-registrato";
import { createResponsibleHDB, updateResponsibleHDB } from "@/HistDatabaseFunctions/handle-responsible";
import { createVehicleHDB, deleteVehicleHDB, updateVehicleHDB } from "@/HistDatabaseFunctions/handle-vehicle";
import { ChooseCandidateResponsible } from "@/utils/choose-candidate-responsible";
import { CalculateMemberAverageIncome } from "@/utils/Trigger-Functions/calculate-member-income";
import { Client } from 'pg';
import { prisma } from './prisma';
const clientBackup = new Client(env.DATABASE_URL);
clientBackup.connect();

clientBackup.query('LISTEN channel_application');
clientBackup.query('LISTEN "channel_housing"');
clientBackup.query('LISTEN "channel_candidate"');
clientBackup.query('LISTEN "channel_creditCard"');
clientBackup.query('LISTEN "channel_expense"');
clientBackup.query('LISTEN "channel_familyMember"');
clientBackup.query('LISTEN "channel_familyMemberDisease"');
clientBackup.query('LISTEN "channel_familyMemberIncome"');
clientBackup.query('LISTEN "channel_financing"');
clientBackup.query('LISTEN "channel_identityDetails"');
clientBackup.query('LISTEN "channel_loan"');
clientBackup.query('LISTEN "channel_medication"');
clientBackup.query('LISTEN "channel_monthlyIncome"');
clientBackup.query('LISTEN "channel_otherExpense"');
clientBackup.query('LISTEN "channel_responsible"');
clientBackup.query('LISTEN "channel_vehicle"');
clientBackup.query('LISTEN "channel_bankaccount"');

clientBackup.on('notification', async (msg) => {
    console.log('Received notification:', msg.payload);
    try {
        if (msg.channel == 'channel_housing') {
            const housing = JSON.parse(msg.payload!);
            if (housing.operation == 'Update') {
                await updateHousingHDB(housing.data.id)
            }
            else if (housing.operation == 'Insert') {
                const openApplications = await getOpenApplications(housing.data.candidate_id || housing.data.legalResponsibleId);
                for (const application of openApplications) {

                    await createHousingHDB(housing.data.id, housing.data.candidate_id, housing.data.legalResponsibleId, application.id)
                }
            }
        }

        if (msg.channel == 'channel_candidate') {
            const candidate = JSON.parse(msg.payload!);
            if (candidate.operation == 'Update') {
                await updateCandidateHDB(candidate.data.id)
            }
            else if (candidate.operation == 'Insert') {
                const openApplications = await getOpenApplications(candidate.data.candidate_id || candidate.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createCandidateHDB(candidate.data.id, candidate.data.candidate_id, candidate.data.legalResponsibleId, application.id)
                }
            }
        }

        if (msg.channel == 'channel_creditCard') {
            const creditCard = JSON.parse(msg.payload!);
            if (creditCard.operation == 'Update') {
                updateCreditCardHDB(creditCard.data.id)
            }
            else if (creditCard.operation == 'Insert') {
                const openApplications = await getOpenApplications(creditCard.data.candidate_id || creditCard.data.legalResponsibleId);
                for (const application of openApplications) {
                    createCreditCardHDB(creditCard.data.id, creditCard.data.candidate_id, creditCard.data.legalResponsibleId, application.id)
                }
            }
        }

        if (msg.channel == 'channel_expense') {
            const expense = JSON.parse(msg.payload!);
            if (expense.operation == 'Update') {
                await updateExpenseHDB(expense.data.id)
            }
            else if (expense.operation == 'Insert') {
                const openApplications = await getOpenApplications(expense.data.candidate_id || expense.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createExpenseHDB(expense.data.id, expense.data.candidate_id, expense.data.legalResponsibleId, application.id)
                }
            }

        }
        if (msg.channel == 'channel_familyMember') {
            const familyMember = JSON.parse(msg.payload!);
            if (familyMember.operation == 'Update') {
                await updateFamilyMemberHDB(familyMember.data.id)
            }
            else if (familyMember.operation == 'Insert') {
                const openApplications = await getOpenApplications(familyMember.data.candidate_id || familyMember.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createFamilyMemberHDB(familyMember.data.id, familyMember.data.candidate_id, familyMember.data.legalResponsibleId, application.id)
                }
            }
        }


        if (msg.channel == 'channel_responsible') {
            const responsible = JSON.parse(msg.payload!);
            if (responsible.operation == 'Update') {
                await updateResponsibleHDB(responsible.data.id)
            }
            else if (responsible.operation == 'Insert') {
                const openApplications = await getOpenApplications(responsible.data.candidate_id || responsible.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createResponsibleHDB(responsible.data.id, responsible.data.candidate_id, responsible.data.legalResponsibleId, application.id)
                }
            }
        }

        if (msg.channel == 'channel_familyMemberDisease') {
            const familyMemberDisease = JSON.parse(msg.payload!);
            const disease = await prisma.familyMemberDisease.findUnique({
                where: { id: familyMemberDisease.data.id },
                include: { familyMember: true }
            })
            if (!disease) {
                return null;
            }
            else {

                if (familyMemberDisease.operation == 'Update') {
                    await updateFamilyMemberDiseaseHDB(familyMemberDisease.data.id)
                }
                else if (familyMemberDisease.operation == 'Insert') {
                    const openApplications = await getOpenApplications((disease.candidate_id || disease.legalResponsibleId || disease.familyMember?.candidate_id || disease.familyMember?.legalResponsibleId)!);
                    for (const application of openApplications) {
                        await createFamilyMemberDiseaseHDB(familyMemberDisease.data.id, (disease.candidate_id || disease.familyMember?.candidate_id || null), (disease.legalResponsibleId || disease.familyMember?.legalResponsibleId || null), application.id)
                    }
                }
                else if (familyMemberDisease.operation == 'Delete') {
                    await deleteFamilyMemberDiseaseHDB(familyMemberDisease.data.id)
                }
            }
        }

        // if (msg.channel == 'channel_familyMemberIncome') {
        //     const familyMemberIncome = JSON.parse(msg.payload!);
        //     const income = await prisma.familyMemberIncome.findUnique({
        //         where: { id: familyMemberIncome.data.id },
        //         include: { familyMember: true }
        //     })
        //     const candidateOrResponsible = income?.candidate_id || income?.legalResponsibleId || income?.familyMember?.candidate_id || income?.familyMember?.legalResponsibleId
        //     if (familyMemberIncome.operation == 'Update') {
        //         await updateFamilyMemberIncomeHDB(familyMemberIncome.data.id)
        //     }
        //     else if (familyMemberIncome.operation == 'Insert') {
        //         const openApplications = await getOpenApplications(candidateOrResponsible!);
        //         for (const application of openApplications) {
        //            await  createFamilyMemberIncomeHDB(familyMemberIncome.data.id, familyMemberIncome.data.candidate_id || income?.familyMember?.candidate_id, familyMemberIncome.data.legalResponsibleId || income?.familyMember?.legalResponsibleId, application.id)
        //         }
        //     }
        //     else if (familyMemberIncome.operation == 'Delete') {
        //         await deleteFamilyMemberIncomeHDB(familyMemberIncome.data.id)
        //     }
        //     await CalculateMemberAverageIncome((income?.candidate_id || income?.familyMember_id || income?.legalResponsibleId)!, income?.employmentType!)

        //     const incomePerCapita = await CalculateIncomePerCapita(candidateOrResponsible!)
        //     const openApplications = await getOpenApplications(candidateOrResponsible!);
        //     for (const application of openApplications) {
        //         await prisma.application.update({
        //             where: { id: application.id },
        //             data: { averageIncome: incomePerCapita.incomePerCapita }
        //         })
        //     }
        // }

        if (msg.channel == 'channel_loan') {
            const loan = JSON.parse(msg.payload!);
            if (loan.operation == 'Update') {
                await updateLoanHDB(loan.data.id)
            }
            else if (loan.operation == 'Insert') {
                const openApplications = await getOpenApplications(loan.data.candidate_id || loan.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createLoanHDB(loan.data.id, loan.data.candidate_id, loan.data.legalResponsibleId, application.id)
                }
            }
        }
        if (msg.channel == 'channel_identityDetails') {
            const identityDetails = JSON.parse(msg.payload!);
            if (identityDetails.operation == 'Update') {
                await updateIdentityDetailsHDB(identityDetails.data.id)
            }
            else if (identityDetails.operation == 'Insert') {
                const openApplications = await getOpenApplications(identityDetails.data.candidate_id || identityDetails.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createIdentityDetailsHDB(identityDetails.data.id, identityDetails.data.candidate_id, identityDetails.data.legalResponsibleId, application.id)
                }
            }
        }
        if (msg.channel == 'channel_otherExpense') {
            const otherExpense = JSON.parse(msg.payload!);
            if (otherExpense.operation == 'Update') {
                updateOtherExpenseHDB(otherExpense.data.id)
            }
            else if (otherExpense.operation == 'Insert') {
                const openApplications = await getOpenApplications(otherExpense.data.candidate_id || otherExpense.data.legalResponsibleId);
                for (const application of openApplications) {
                    createOtherExpenseHDB(otherExpense.data.id, otherExpense.data.candidate_id, otherExpense.data.legalResponsibleId, application.id)
                }
            }
        }
        if (msg.channel == 'channel_medication') {
            const medication = JSON.parse(msg.payload!);
            const Medication = await prisma.medication.findUnique({
                where: { id: medication.data.id },
                include: { familyMember: true }
            })
            if (medication.operation == 'Update') {
                updateMedicationHDB(medication.data.id)
            }
            else if (medication.operation == 'Insert') {
                const openApplications = await getOpenApplications(medication.data.candidate_id || medication.data.legalResponsibleId || Medication?.familyMember?.candidate_id || Medication?.familyMember?.legalResponsibleId);
                for (const application of openApplications) {
                    createMedicationHDB(medication.data.id, medication.data.candidate_id || Medication?.familyMember?.candidate_id, medication.data.legalResponsibleId || Medication?.familyMember?.legalResponsibleId, application.id)
                }
            }
            else if (medication.operation == 'Delete') {
                await deleteMedicationHDB(medication.data.id)
            }
        }
        if (msg.channel == 'channel_monthlyIncome') {
            const monthlyIncome = JSON.parse(msg.payload!);
            const monthIncome = await prisma.monthlyIncome.findUnique({
                where: { id: monthlyIncome.data.id },
                include: { familyMember: true }

            })
            await CalculateMemberAverageIncome(monthlyIncome.data.candidate_id || monthlyIncome.data.familyMember_id || monthIncome?.legalResponsibleId, monthlyIncome.data.incomeSource)
            if (monthlyIncome.operation == 'Update') {
                await updateMonthlyIncomeHDB(monthlyIncome.data.id)
            }
            else if (monthlyIncome.operation == 'Insert') {
                const openApplications = await getOpenApplications(monthlyIncome.data.candidate_id || monthlyIncome.data.legalResponsibleId);
                for (const application of openApplications) {
                    await createMonthlyIncomeHDB(monthlyIncome.data.id, monthlyIncome.data.candidate_id, monthlyIncome.data.legalResponsibleId, application.id)
                }

            }
            else if (monthlyIncome.operation == 'Delete') {
                await deleteMonthlyIncomeHDB(monthlyIncome.data.id)
            }
        }

        if (msg.channel == 'channel_vehicle') {
            const vehicle = JSON.parse(msg.payload!);
            if (vehicle.operation == 'Update') {
                updateVehicleHDB(vehicle.data.id)
            }
            else if (vehicle.operation == 'Insert') {
                const openApplications = await getOpenApplications(vehicle.data.candidate_id || vehicle.data.legalResponsibleId);
                for (const application of openApplications) {
                    createVehicleHDB(vehicle.data.id, vehicle.data.candidate_id, vehicle.data.legalResponsibleId, application.id)
                }
            }
            else if (vehicle.operation == 'Delete') {
                await deleteVehicleHDB(vehicle.data.id)
            }
        }
        if (msg.channel == 'channel_bankaccount') {
            const bankaccount = JSON.parse(msg.payload!);
            const bankaccountInfo = await prisma.bankAccount.findUnique({
                where: { id: bankaccount.data.id },
                include: { familyMember: true }
            })
            if (bankaccount.operation == 'Update') {
                updateBankAccountHDB(bankaccount.data.id)
            }
            else if (bankaccount.operation == 'Insert') {
                const openApplications = await getOpenApplications(bankaccount.data.candidate_id || bankaccount.data.legalResponsibleId || bankaccountInfo?.familyMember?.candidate_id || bankaccountInfo?.familyMember?.legalResponsibleId);
                for (const application of openApplications) {
                    createBankAccountHDB(bankaccount.data.id, bankaccount.data.candidate_id, bankaccount.data.legalResponsibleId, application.id)
                }
            }
            else if (bankaccount.operation == 'Delete') {
                await deleteBankAccountHDB(bankaccount.data.id)
            }
        }



        if (msg.channel == 'channel_application') {
            const application = JSON.parse(msg.payload!);
            const application_id = application.id
            const candidate_id = application.candidate_id
            const responsible_id = application.responsible_id
            console.log('Feito')
            const findUserDetails = await ChooseCandidateResponsible(candidate_id)
            if (!findUserDetails) {
                return null
            }
            const idField = findUserDetails.IsResponsible ? { responsible_id: responsible_id } : { candidate_id: candidate_id }
            const findIdentityDetails = await prisma.identityDetails.findUnique({
                where: { ...findUserDetails.IsResponsible ? { responsible_id: responsible_id } : { candidate_id: candidate_id } }
            })

            const findFamilyMembers = await prisma.familyMember.findMany({
                where: { ...findUserDetails.IsResponsible ? { legalResponsibleId: responsible_id } : { candidate_id: candidate_id } }
            }
            )
            const findHousing = await prisma.housing.findUnique({
                where: { ...findUserDetails.IsResponsible ? { responsible_id: responsible_id } : { candidate_id: candidate_id } }
            });

            const findVehicle = await prisma.vehicle.findMany({
                where: { ...findUserDetails.IsResponsible ? { legalResponsibleId: responsible_id } : { candidate_id: candidate_id } }
            });

            const findFamilyMemberIncome = await findAllIncome(candidate_id, responsible_id)

            const findMonthlyIncome = await findAllMonthlyIncome(candidate_id, responsible_id)

            const findExpense = await findAllExpense(candidate_id, responsible_id)

            const findLoan = await findAllLoan(candidate_id, responsible_id)

            const findFinancing = await findAllFinancing(candidate_id, responsible_id)

            const findCreditCard = await findAllCreditCard(candidate_id, responsible_id)
            const findOtherExpense = await prisma.otherExpense.findMany({
                where: { ...findUserDetails.IsResponsible ? { legalResponsibleId: responsible_id } : { candidate_id: candidate_id } }
            });

            const findFamilyMemberDisease = await findAllDiseases(candidate_id, responsible_id)
            const findMedication = await findAllMedication(candidate_id, responsible_id)
            const findBankAccount = await findAllBankAccount(candidate_id, responsible_id)

            await createResponsibleHDB(responsible_id, candidate_id, responsible_id, application_id)
            await createCandidateHDB(candidate_id, '', responsible_id, application_id)

            // ... repeat for the FamilyMember table ...

            for (const familyMember of findFamilyMembers) {
                await createFamilyMemberHDB(familyMember.id, candidate_id, responsible_id, application_id)
            }
            await createIdentityDetailsHDB(findIdentityDetails!.id, candidate_id, responsible_id, application_id)

            await createHousingHDB(findHousing!.id, candidate_id, responsible_id, application_id)


            for (const familyMemberIncome of findFamilyMemberIncome!) {
                await createFamilyMemberIncomeHDB(familyMemberIncome.id, candidate_id, responsible_id, application_id)
            }

            for (const vehicle of findVehicle!) {
                await createVehicleHDB(vehicle.id, candidate_id, responsible_id, application_id)
            }
            for (const monthlyIncome of findMonthlyIncome!) {
                await createMonthlyIncomeHDB(monthlyIncome.id, candidate_id, responsible_id, application_id)
            }
            for (const bankAccount of findBankAccount!) {
                await createBankAccountHDB(bankAccount.id, candidate_id, responsible_id, application_id)

            }
            for (const expense of findExpense!) {
                await createExpenseHDB(expense.id, candidate_id, responsible_id, application_id)
            }
            for (const loan of findLoan!) {
                await createLoanHDB(loan.id, candidate_id, responsible_id, application_id)
            }

            for (const financing of findFinancing!) {
                await createLoanHDB(financing.id, candidate_id, responsible_id, application_id)
            }

            // Para creditCard
            for (const creditCard of findCreditCard!) {
                await createCreditCardHDB(creditCard.id, candidate_id, responsible_id, application_id)
            }

            // Para otherExpense
            for (const otherExpense of findOtherExpense) {
                await createOtherExpenseHDB(otherExpense.id, candidate_id, responsible_id, application_id)
            }

            // Para familyMemberDisease
            for (const familyMemberDisease of findFamilyMemberDisease!) {
                await createFamilyMemberDiseaseHDB(familyMemberDisease.id, candidate_id, responsible_id, application_id)
            }

            // Para medication
            for (const medication of findMedication!) {
                await createMedicationHDB(medication.id, candidate_id, responsible_id, application_id)
            }


            // Para o registrato
            await createRegistratoHDB(responsible_id ? responsible_id : candidate_id, candidate_id, responsible_id, application_id)
            for (const familyMember of findFamilyMembers) {
                await createRegistratoHDB(familyMember.id, candidate_id, responsible_id, application_id)
            }


            // For declarations 
            await createDeclarationHDB(findUserDetails.UserData.id, findUserDetails.UserData.id, application_id)
            for (const familyMember of findFamilyMembers) {
                await createDeclarationHDB(familyMember.id, findUserDetails.UserData.id, application_id)
            }
        }
    } catch (error) {
        console.log(error)
    }
});

module.exports = clientBackup;

