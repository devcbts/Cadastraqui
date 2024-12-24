import { env } from "process";

import getOpenApplications from "@/HistDatabaseFunctions/find-open-applications";
import findAllBankAccount from "@/HistDatabaseFunctions/Handle Application/find-all-bank-account";
import findAllDiseases from "@/HistDatabaseFunctions/Handle Application/find-all-diseases";
import findAllExpense from "@/HistDatabaseFunctions/Handle Application/find-all-expense";
import findAllIncome from "@/HistDatabaseFunctions/Handle Application/find-all-income";
import findAllMedication from "@/HistDatabaseFunctions/Handle Application/find-all-medication";
import findAllMonthlyIncome from "@/HistDatabaseFunctions/Handle Application/find-all-monthly-income";
import { createBankAccountHDB, deleteBankAccountHDB, updateBankAccountHDB } from "@/HistDatabaseFunctions/handle-bank-account";
import { createCandidateHDB, updateCandidateHDB } from "@/HistDatabaseFunctions/handle-candidate";
import { createDeclarationHDB } from "@/HistDatabaseFunctions/handle-declaration";
import { createExpenseHDB, deleteExpenseHDB, updateExpenseHDB } from "@/HistDatabaseFunctions/handle-expenses";
import { createFamilyMemberHDB, deleteFamilyMemberHDB, updateFamilyMemberHDB } from "@/HistDatabaseFunctions/handle-family-member";
import { createFamilyMemberDiseaseHDB, deleteFamilyMemberDiseaseHDB, updateFamilyMemberDiseaseHDB } from "@/HistDatabaseFunctions/handle-family-member-disease";
import { createFamilyMemberIncomeHDB, deleteFamilyMemberIncomeHDB, updateFamilyMemberIncomeHDB } from "@/HistDatabaseFunctions/handle-family-member-income";
import { createHousingHDB, updateHousingHDB } from "@/HistDatabaseFunctions/handle-housing";
import { createIdentityDetailsHDB, updateIdentityDetailsHDB } from "@/HistDatabaseFunctions/handle-identity-details";
import { createMedicationHDB, deleteMedicationHDB, updateMedicationHDB } from "@/HistDatabaseFunctions/handle-medication";
import { createMonthlyIncomeHDB, deleteMonthlyIncomeHDB, updateMonthlyIncomeHDB } from "@/HistDatabaseFunctions/handle-monthly-income";
import { CreatePixHDB } from "@/HistDatabaseFunctions/handle-pix-HDB";
import { createRegistratoHDB } from "@/HistDatabaseFunctions/handle-registrato";
import { createResponsibleHDB, updateResponsibleHDB } from "@/HistDatabaseFunctions/handle-responsible";
import { createVehicleHDB, deleteVehicleHDB, updateVehicleHDB } from "@/HistDatabaseFunctions/handle-vehicle";
import { ChooseCandidateResponsible } from "@/utils/choose-candidate-responsible";
import { CalculateIncomePerCapita } from "@/utils/Trigger-Functions/calculate-income-per-capita";
import { CalculateMemberAverageIncome } from "@/utils/Trigger-Functions/calculate-member-income";
import verifyBankStatement from "@/utils/Trigger-Functions/verify-bank-statements";
import verifyExpenses from "@/utils/Trigger-Functions/verify-expenses";
import { verifyHealthRegistration } from "@/utils/Trigger-Functions/verify-health-registration";
import { verifyIncomeBankRegistration } from "@/utils/Trigger-Functions/verify-income-bank-registration";
import verifyIncomesCompletion from "@/utils/Trigger-Functions/verify-incomes-completion";
import { Client } from 'pg';
import { IdentityDetails, FamilyMember } from '../../backup_prisma/generated/clientBackup/index';
import { prisma } from './prisma';
import verifyDeclarationRegistration from "@/utils/Trigger-Functions/verify-declaration-registration";
import { createBankBalanceHDB, deleteBankBalanceHDB, updateBankBalanceHDB } from "@/HistDatabaseFunctions/handle-bank-balance";

const clientBackup = new Client(env.DATABASE_URL);
const connectClient = async () => {
    try {
        await clientBackup.connect();
        console.log('Connected to the database');

        await clientBackup.query('LISTEN channel_application');
        await clientBackup.query('LISTEN "channel_housing"');
        await clientBackup.query('LISTEN "channel_candidate"');
        await clientBackup.query('LISTEN "channel_creditCard"');
        await clientBackup.query('LISTEN "channel_expense"');
        await clientBackup.query('LISTEN "channel_familyMember"');
        await clientBackup.query('LISTEN "channel_familyMemberDisease"');
        await clientBackup.query('LISTEN "channel_familyMemberIncome"');
        await clientBackup.query('LISTEN "channel_financing"');
        await clientBackup.query('LISTEN "channel_identityDetails"');
        await clientBackup.query('LISTEN "channel_loan"');
        await clientBackup.query('LISTEN "channel_medication"');
        await clientBackup.query('LISTEN "channel_monthlyIncome"');
        await clientBackup.query('LISTEN "channel_otherExpense"');
        await clientBackup.query('LISTEN "channel_responsible"');
        await clientBackup.query('LISTEN "channel_vehicle"');
        await clientBackup.query('LISTEN "channel_bankaccount"');
        await clientBackup.query('LISTEN "channel_candidate_documents"')
        await clientBackup.query('LISTEN "channel_audit"');
        await clientBackup.query('LISTEN "channel_finished_registration"')
        await clientBackup.query('LISTEN "channel_bank_balance"')
    } catch (err) {
        console.error('Failed to connect to the database', err);
        await clientBackup.end();
        setTimeout(connectClient, 5000); // Retry connection after 5 seconds
    }
};
connectClient();

clientBackup.on("error", async (err) => {
    console.error('Error in database connection', err);
    await clientBackup.end();
    setTimeout(connectClient, 5000); // Retry connection after 5 seconds
})

clientBackup.on('notification', async (msg) => {
    console.log('infos')
    console.log('Received notification:', msg.payload);
    try {


        switch (msg.channel) {



            case ('channel_candidate_documents'):
                const document = JSON.parse(msg.payload!);

                if (document.operation == 'Insert' || document.operation == 'Update') {
                    switch (document.data.tableName) {
                        case 'statement':
                            await verifyBankStatement(document.data.tableId)
                            break;
                        case 'pix':
                            await verifyIncomeBankRegistration(document.data.tableId)
                            break;
                        case 'registrato':
                            await verifyIncomeBankRegistration(document.data.tableId)
                            break;


                    }
                }
                break;


            case 'channel_housing': {
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

            case 'channel_candidate': {
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



            case 'channel_expense': {
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
                else if (expense.operation == 'Delete') {
                    await deleteExpenseHDB(expense.data.id, expense.data.candidate_id || expense.data.legalResponsibleId)
                }

                await verifyExpenses(expense.data.candidate_id || expense.data.legalResponsibleId)

            }
            case 'channel_familyMember': {
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
                if (familyMember.operation == 'Delete') {
                    await deleteFamilyMemberHDB(familyMember.data.id, familyMember.data.candidate_id || familyMember.data.legalResponsibleId)
                }
                await verifyHealthRegistration(familyMember.data.candidate_id || familyMember.data.legalResponsibleId)
                await verifyIncomesCompletion(familyMember.data.candidate_id || familyMember.data.legalResponsibleId)
                await verifyDeclarationRegistration(familyMember.data.candidate_id || familyMember.data.legalResponsibleId)

            }


            case 'channel_responsible': {
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

            case 'channel_familyMemberDisease': {
                const familyMemberDisease = JSON.parse(msg.payload!);
                const disease = await prisma.familyMemberDisease.findUnique({
                    where: { id: familyMemberDisease.data.id },
                    include: { familyMember: true }
                })
                if (!disease) {
                    const memberId = familyMemberDisease.data.familyMember_id || familyMemberDisease.data.candidate_id || familyMemberDisease.data.legalResponsibleId
                    if (familyMemberDisease.operation == 'Delete') {
                        await deleteFamilyMemberDiseaseHDB(familyMemberDisease.data.id, memberId)
                    }

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

                    await verifyHealthRegistration((disease.candidate_id || disease.legalResponsibleId || disease.familyMember?.candidate_id || disease.familyMember?.legalResponsibleId)!)
                }
                break;
            }

            case 'channel_familyMemberIncome': {
                const familyMemberIncome = JSON.parse(msg.payload!);
                const income = await prisma.familyMemberIncome.findUnique({
                    where: { id: familyMemberIncome.data.id },
                    include: { familyMember: true }
                })
                const candidateOrResponsible = familyMemberIncome.data.candidate_id || familyMemberIncome.data.legalResponsibleId || income?.familyMember?.candidate_id || income?.familyMember?.legalResponsibleId
                if (familyMemberIncome.operation == 'Update') {
                    await updateFamilyMemberIncomeHDB(familyMemberIncome.data.id)
                }
                else if (familyMemberIncome.operation == 'Insert') {
                    const openApplications = await getOpenApplications(candidateOrResponsible!);
                    for (const application of openApplications) {
                        await createFamilyMemberIncomeHDB(familyMemberIncome.data.id, familyMemberIncome.data.candidate_id || income?.familyMember?.candidate_id, familyMemberIncome.data.legalResponsibleId || income?.familyMember?.legalResponsibleId, application.id)
                    }
                }
                else if (familyMemberIncome.operation == 'Delete') {
                    await deleteFamilyMemberIncomeHDB(familyMemberIncome.data.id, candidateOrResponsible || familyMemberIncome.data.familyMember_id)
                }

                const incomePerCapita = await CalculateIncomePerCapita(candidateOrResponsible!)
                const openApplications = await getOpenApplications(candidateOrResponsible!);
                for (const application of openApplications) {
                    await prisma.application.update({
                        where: { id: application.id },
                        data: { averageIncome: incomePerCapita.incomePerCapita }
                    })
                }
                await verifyIncomeBankRegistration(familyMemberIncome.data.candidate_id || familyMemberIncome.data.legalResponsibleId || familyMemberIncome.data.familyMember_id)
                break;

            }


            case 'channel_identityDetails': {
                const identityDetails: { operation: string, data: IdentityDetails } = JSON.parse(msg.payload!);
                if (identityDetails.operation == 'Update') {
                    await updateIdentityDetailsHDB(identityDetails.data.id)
                }
                else if (identityDetails.operation == 'Insert') {
                    const openApplications = await getOpenApplications(identityDetails.data.candidate_id ?? identityDetails.data.responsible_id ?? '');
                    for (const application of openApplications) {
                        await createIdentityDetailsHDB(identityDetails.data.id, identityDetails.data.candidate_id, identityDetails.data.responsible_id, application.id)
                    }
                }
                await verifyHealthRegistration(identityDetails.data.candidate_id ?? identityDetails.data.responsible_id ?? '')
                await verifyIncomesCompletion(identityDetails.data.candidate_id ?? identityDetails.data.responsible_id ?? '')
                break;

            }

            case 'channel_medication': {
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
                    await deleteMedicationHDB(medication.data.id, medication.data.familyMember_id || medication.data.candidate_id || medication.data.legalResponsibleId)
                }
                await verifyHealthRegistration(medication.data.candidate_id || medication.data.legalResponsibleId || Medication?.familyMember?.candidate_id || Medication?.familyMember?.legalResponsibleId)
                break;

            }
            case 'channel_monthlyIncome': {
                const monthlyIncome = JSON.parse(msg.payload!);
                const income = await prisma.monthlyIncome.findUnique({
                    where: { id: monthlyIncome.data.id },
                    include: { familyMember: true }
                })
                await CalculateMemberAverageIncome(monthlyIncome.data.candidate_id || monthlyIncome.data.familyMember_id || monthlyIncome.data.legalResponsibleId, monthlyIncome.data.incomeSource)
                if (monthlyIncome.operation == 'Update') {
                    await updateMonthlyIncomeHDB(monthlyIncome.data.id)
                }
                else if (monthlyIncome.operation == 'Insert') {
                    const openApplications = await getOpenApplications(monthlyIncome.data.candidate_id || monthlyIncome.data.legalResponsibleId || income?.familyMember?.candidate_id || income?.familyMember?.legalResponsibleId);
                    for (const application of openApplications) {
                        await createMonthlyIncomeHDB(monthlyIncome.data.id, monthlyIncome.data.candidate_id, monthlyIncome.data.legalResponsibleId, application.id)
                    }

                }
                else if (monthlyIncome.operation == 'Delete') {
                    await deleteMonthlyIncomeHDB(monthlyIncome.data.id, monthlyIncome.data.familyMember_id || monthlyIncome.data.candidate_id || monthlyIncome.data.legalResponsibleId)
                }
                break;


            }

            case 'channel_vehicle': {
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
                    await deleteVehicleHDB(vehicle.data.id, vehicle.data.candidate_id || vehicle.data.legalResponsibleId)
                }
                break;

            }
            case 'channel_bankaccount': {
                const bankaccount = JSON.parse(msg.payload!);
                const bankaccountInfo = await prisma.bankAccount.findUnique({
                    where: { id: bankaccount.data.id },
                    include: { familyMember: true }
                })
                const candidateOrResponsible = bankaccount.data.candidate_id || bankaccount.data.legalResponsibleId || bankaccountInfo?.familyMember?.candidate_id || bankaccountInfo?.familyMember?.legalResponsibleId
                if (bankaccount.operation == 'Update') {
                    updateBankAccountHDB(bankaccount.data.id)
                }
                else if (bankaccount.operation == 'Insert') {
                    const openApplications = await getOpenApplications(candidateOrResponsible);
                    for (const application of openApplications) {
                        createBankAccountHDB(bankaccount.data.id, bankaccount.data.candidate_id || bankaccountInfo?.familyMember?.candidate_id, bankaccount.data.legalResponsibleId || bankaccountInfo?.familyMember?.legalResponsibleId, application.id)
                    }
                }
                else if (bankaccount.operation == 'Delete') {
                    await deleteBankAccountHDB(bankaccount.data.id, candidateOrResponsible || bankaccount.data.familyMember_id)
                }
                await verifyIncomeBankRegistration(bankaccount.data.candidate_id || bankaccount.data.legalResponsibleId || bankaccountInfo?.familyMember_id)
                break;

            }

            case "channel_bank_balance": {
                const bankBalance = JSON.parse(msg.payload!);
                const bankBalanceInfo = await prisma.bankBalance.findUnique({
                    where: { id: bankBalance.data.id },
                    include: {
                        bankAccount:{
                            include:{
                                familyMember:true
                            }
                        }
                    }
                    
                })
                const candidateOrResponsible = bankBalance.data.bankAccount?.candidate_id || bankBalance.data.bankAccount?.legalResponsibleId || bankBalanceInfo?.bankAccount?.familyMember?.candidate_id || bankBalanceInfo?.bankAccount?.familyMember?.legalResponsibleId
                if (bankBalance.operation == 'Insert') {
                    const openApplications = await getOpenApplications(candidateOrResponsible);
                    for (const application of openApplications) {
                        
                        await createBankBalanceHDB(bankBalance.data.id, application.id)
                    }
                    
                }
                if (bankBalance.operation == 'Update') {
                    await updateBankBalanceHDB(bankBalance.data.id)
                    
                }
                if (bankBalance.operation == 'Delete') {
                    await deleteBankBalanceHDB(bankBalance.data.id)
                    
                }
                await verifyBankStatement(bankBalance.data.bankAccount_id)
                break;
            }

            case 'channel_application': {
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
                await CreatePixHDB(responsible_id ? responsible_id : candidate_id, candidate_id, responsible_id, application_id)
                for (const familyMember of findFamilyMembers) {
                    await CreatePixHDB(familyMember.id, candidate_id, responsible_id, application_id)
                }

                // For declarations 
                await createDeclarationHDB(findUserDetails.UserData.id, findUserDetails.UserData.id, application_id)
                for (const familyMember of findFamilyMembers) {
                    await createDeclarationHDB(familyMember.id, findUserDetails.UserData.id, application_id)
                }
                break;

            }
        }
    } catch (error) {
        console.log(error)
    }
});

module.exports = clientBackup;

