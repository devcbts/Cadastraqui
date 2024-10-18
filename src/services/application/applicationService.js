import bankAccountMapper from "services/candidate/mappers/bank-account-mapper";
import employementTypeMapper from "services/candidate/mappers/employement-type-mapper";
import expenseMapper from "services/candidate/mappers/expense-mapper";
import familyMemberMapper from "services/candidate/mappers/family-member-mapper";
import habitationMapper from "services/candidate/mappers/habitation-mapper";
import healthInfoMapper from "services/candidate/mappers/health-info-mapper";
import identityInfoMapper from "services/candidate/mappers/identity-info-mapper";
import incomeMapper from "services/candidate/mappers/income-mapper";
import vehicleMapper from "services/candidate/mappers/vehicle-mapper";
import resumeMapper from "services/socialAssistant/mappers/resume-mapper";
import removeObjectFileExtension from "utils/remove-file-ext";

const { api } = require("services/axios");

class ApplicationService {


    async getCandidateIdentityInfo(applicationId) {
        const response = await api.get(`/application/candidateInfo/identity/${applicationId}`);
        return identityInfoMapper.fromPersistence({ ...response.data, urls: response.data.urls })
    }
    async getCandidateFamilyGroup(applicationId) {
        const response = await api.get(`/application/candidateInfo/family/${applicationId}`);
        return response.data.familyMembers?.map(e => familyMemberMapper.fromPersistence(e))

    }
    async getHousingInfo(applicationId) {
        const response = await api.get(`/application/candidateInfo/housing/${applicationId}`);
        return habitationMapper.fromPersistence(response.data)
    }
    async getAllIncomes(applicationId) {
        const response = await api.get(`/application/candidateInfo/income/${applicationId}`);
        return employementTypeMapper.fromPersistence(response.data)
    }


    async getVehicleInfo(applicationId) {
        const response = await api.get(`/application/candidateInfo/vehicle/${applicationId}`);
        return vehicleMapper.fromPersistence(response.data.vehicleInfoResults)

    }
    async getExpenses(applicationId) {
        const response = await api.get(`/application/candidateInfo/expenses/${applicationId}`);
        return expenseMapper.fromPersistence(response.data)

    }
    async getMemberIncomeInfo(applicationId, memberId) {
        const response = await api.get(`/application/candidateInfo/monthly-income/${applicationId}/${memberId}`);
        const memberIncome = await this.getAllIncomes(applicationId)
        const monthlyIncome = incomeMapper.fromPersistence(response.data.incomeBySource)
        return { monthlyIncome, info: memberIncome.incomes?.find(e => e.id === memberId).months, data: memberIncome.incomes?.find(e => e.id === memberId) }
    }
    async getBankingAccountById(applicationId, id) {
        const response = await api.get(`/application/candidateInfo/bank-info/${applicationId}/${id}`)
        return {
            accounts: bankAccountMapper.fromPersistence(response.data),
            hasBankAccount: response.data.hasBankAccount,
        }
    }
    async getHealthInfo(applicationId) {
        const response = await api.get(`/application/candidateInfo/health/${applicationId}`)
        return healthInfoMapper.fromPersistence(response.data.healthInfoResultsWithUrls)
    }
    async getCCSFiles(applicationId, id) {
        const response = await api.get(`/application/candidateInfo/ccs/files/${applicationId}/${id}`)
        return response.data
    }
    async getMemberIncomeStatus(applicationId, id) {
        const response = await api.get(`/application/candidateInfo/income/status/${applicationId}/${id}`)
        const { bankAccountUpdated, IncomesUpdated, CCS_Updated } = response.data
        return { bank: bankAccountUpdated, income: IncomesUpdated, ccs: CCS_Updated }
    }
    async getDeclarations(applicationId) {
        const response = await api.get(`/application/candidateInfo/declaration/${applicationId}`)
        return response.data.declarations?.map(e => ({ ...e, urls: removeObjectFileExtension(e.url) }))
    }
}

export default new ApplicationService()