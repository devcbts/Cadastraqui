import { historyDatabase } from '@/lib/prisma';
import { section } from '../../http/controllers/social-assistant/enums/Section';
import { SelectCandidateResponsibleHDB } from '../select-candidate-responsibleHDB';
export default async function getSectionInitalContent(sectionToSearch: section, application_id: string, member_id: string, table_id: string | null) {

    const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id);
    if (!candidateOrResponsibleHDB) {
        return null
    }

    const idField = candidateOrResponsibleHDB.UserData.id ? { candidate_id: candidateOrResponsibleHDB.UserData.id } : { legalResponsibleId: candidateOrResponsibleHDB.UserData.id };
    let MemberBankDetails

    const isFamilyMember = candidateOrResponsibleHDB.UserData.id !== member_id;
    switch (sectionToSearch) {
        case "identity":
            if (isFamilyMember) {
                return null
            }
            const identityDetails = await historyDatabase.identityDetails.findUniqueOrThrow({
                where: { application_id }
            })

            const content = `Os dados de identidade são: ${JSON.stringify(identityDetails)}.`
            return content;
        case "family-member":
            const familyMembers = await historyDatabase.familyMember.findUnique({
                where: { application_id, id: member_id }
            })
            if (!familyMembers) {
                return null
            }
            const contentFamilyMembers = `Os membros da família são: ${JSON.stringify(familyMembers)}.`
            return contentFamilyMembers;
        case "housing":
            const housingDetails = await historyDatabase.housing.findUnique({
                where: { application_id, OR: [{ candidate_id: member_id }, { responsible_id: member_id }] }
            })
            if (!housingDetails) {
                return null
            }
            const contentHousing = `Os dados de moradia são: ${JSON.stringify(housingDetails)}.`
            return contentHousing;
        case "vehicle":
            const vehicleDetails = await historyDatabase.vehicle.findMany({
                where: { application_id }
            })

            const contentVehicle = `Os dados do veículo são: ${JSON.stringify(vehicleDetails)}. `
            return contentVehicle;
        case "expenses":
            const expensesDetails = await historyDatabase.expense.findMany({
                where: { application_id }
            })

            const contentExpenses = `Os dados de despesas são: ${JSON.stringify(expensesDetails)}.`
            return contentExpenses;
        case "income":
            let MemberIncomeDetails
            if (!isFamilyMember) {

                MemberIncomeDetails = await historyDatabase.identityDetails.findUnique({
                    where: { application_id },
                    select: {
                        candidate_id: true,
                        responsible_id: true,
                        fullName: true,
                        birthDate: true,
                        profession: true,
                        email: true,
                        CPF: true,
                        RG: true
                    }
                })
            }
            else {

                MemberIncomeDetails = await historyDatabase.familyMember.findUnique({
                    where: { application_id, id: member_id },
                    select: {
                        id: true,
                        fullName: true,
                        birthDate: true,
                        profession: true,
                        email: true,
                        CPF: true,
                        RG: true
                    }
                })
            }


            const familyMemberIncomes = await historyDatabase.familyMemberIncome.findUnique({
                where: { application_id, id: table_id!, OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] },
                include: {
                    MonthlyIncomes: {
                        select: {
                            id: true,
                            grossAmount: true,
                            liquidAmount: true,
                            date: true,
                        },
                        where: {
                            receivedIncome: true
                        }
                    }
                }
            });



            let incomeDetailsPerMember = {}
            incomeDetailsPerMember = {
                MemberIncomeDetails,
                familyMemberIncomes
            }

            const contentIncome = `Os dados de renda são: ${JSON.stringify(incomeDetailsPerMember)}.`;

            return contentIncome;
        case "health":

            let MemberHealthDetails
            if (!isFamilyMember) {

                MemberHealthDetails = await historyDatabase.identityDetails.findUnique({
                    where: { application_id },
                    select: {
                        candidate_id: true,
                        responsible_id: true,
                        fullName: true,
                        birthDate: true,
                        profession: true,
                        email: true,
                        CPF: true,
                        RG: true
                    }
                })
            }
            else {

                MemberHealthDetails = await historyDatabase.familyMember.findUnique({
                    where: { application_id, id: member_id },
                    select: {
                        id: true,
                        fullName: true,
                        birthDate: true,
                        profession: true,
                        email: true,
                        CPF: true,
                        RG: true
                    }
                })
            }
            const healthDetails = await historyDatabase.familyMemberDisease.findMany({
                where: {
                    application_id,
                    OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }]
                },
                include: {
                    Medication: true
                }
            })
            const medicationsWithoutHealthDetails = await historyDatabase.medication.findMany({
                where: { AND: [{ application_id }, { familyMemberDiseaseId: null }, { OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }] }
            })
            let healthDetailsPerMember

            healthDetailsPerMember = {
                MemberHealthDetails,
                healthDetails,
                medicationsWithoutHealthDetails
            }
            const contentHealth = `Os dados de saúde são: ${JSON.stringify(healthDetailsPerMember)}.`
            return contentHealth;

        case "statement":
        case "registrato":
        case "pix":
            if (!isFamilyMember) {

                MemberBankDetails = await historyDatabase.identityDetails.findUnique({
                    where: { application_id },
                    select: {
                        candidate_id: true,
                        responsible_id: true,
                        fullName: true,
                        birthDate: true,
                        profession: true,
                        email: true,
                        CPF: true,
                        RG: true
                    }
                })
            }
            else {

                MemberBankDetails = await historyDatabase.familyMember.findUnique({
                    where: { application_id, id: member_id },
                    select: {
                        id: true,
                        fullName: true,
                        birthDate: true,
                        profession: true,
                        email: true,
                        CPF: true,
                        RG: true
                    }
                })
            }



            const bankAccounts = await historyDatabase.bankAccount.findMany({
                where: { application_id, OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }
            });
            // Organizar dados de contas bancárias
            let bankDetailsPerMember = {};
            bankDetailsPerMember = {
                MemberBankDetails,
                bankAccounts
            }
            const contentStatement = `Os dados bancários são: ${JSON.stringify(bankDetailsPerMember)}`;
            return contentStatement;
        case 'declaracoes':
            let MemberDeclarationDetails
            const identityDetailsDeclaration = await historyDatabase.identityDetails.findUnique({
                where: { application_id },

            })
            if (!isFamilyMember) {
                MemberDeclarationDetails = identityDetailsDeclaration;
            } else {
                MemberDeclarationDetails = await historyDatabase.familyMember.findUnique({
                    where: { application_id, id: member_id },


                });
                MemberDeclarationDetails = { ...identityDetailsDeclaration, ...MemberDeclarationDetails };
            }

            const memberDeclarationsIncome = await historyDatabase.familyMemberIncome.findMany({
                where: { application_id, OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }
            })

            const memberDeclarationsBank = await historyDatabase.bankAccount.findMany({
                where: { application_id, OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }] }
            })

            const memberHousingDeclarations = await historyDatabase.housing.findUnique({
                where: { application_id}
            })
            const memberVehicleDeclarations = await historyDatabase.vehicle.findMany({
                where: { application_id }
            })

            return `Os dados preenchidos são: ${JSON.stringify({ MemberDeclarationDetails, memberDeclarationsIncome, memberDeclarationsBank, memberHousingDeclarations, memberVehicleDeclarations })}`
        default:
            return "Nenhum conteúdo encontrado"
    }
}