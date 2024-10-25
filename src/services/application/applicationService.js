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
    constructor(applicationId) {
        this.applicationId = this.applicationId
    }
    setApplicationId(appId) {
        this.applicationId = appId
        return this
    }
    async getIdentityInfo() {
        const response = await api.get(`/application/candidateInfo/identity/${this.applicationId}`);
        return identityInfoMapper.fromPersistence({ ...response.data, urls: response.data.urls })
    }
    async getFamilyMembers() {
        const response = await api.get(`/application/candidateInfo/family/${this.applicationId}`);
        return {
            members: response.data.familyMembers?.map(e => familyMemberMapper.fromPersistence(e)),
            livesAlone: response.data.livesAlone
        }

    }
    async getHousingInfo() {
        const response = await api.get(`/application/candidateInfo/housing/${this.applicationId}`);
        return habitationMapper.fromPersistence(response.data)
    }
    async getAllIncomes() {

        const response = await api.get(`/application/candidateInfo/income/${this.applicationId}`);
        return employementTypeMapper.fromPersistence(response.data)
    }


    async getVehicle() {
        const response = await api.get(`/application/candidateInfo/vehicle/${this.applicationId}`);
        return {
            vehicles: vehicleMapper.fromPersistence(response.data.vehicleInfoResults),
            hasVehicles: response?.data?.hasVehicles
        }
    }
    async getExpenses() {
        const response = await api.get(`/application/candidateInfo/expenses/${this.applicationId}`);
        return expenseMapper.fromPersistence(response.data)

    }
    async getMemberIncomeInfo(memberId) {
        const response = await api.get(`/application/candidateInfo/monthly-income/${this.applicationId}/${memberId}`);
        const memberIncome = await this.getAllIncomes()
        const monthlyIncome = incomeMapper.fromPersistence(response.data.incomeBySource)
        return { monthlyIncome, info: memberIncome.incomes?.find(e => e.id === memberId).months, data: memberIncome.incomes?.find(e => e.id === memberId) }
    }
    async getBankingAccountById(id) {
        const response = await api.get(`/application/candidateInfo/bank-info/${this.applicationId}/${id}`)
        return {
            accounts: bankAccountMapper.fromPersistence(response.data),
            hasBankAccount: response.data.hasBankAccount,
        }
    }
    async getHealthInfo() {
        const response = await api.get(`/application/candidateInfo/health/${this.applicationId}`)
        return healthInfoMapper.fromPersistence(response.data.healthInfoResultsWithUrls)
    }
    async getCCSFiles(id) {
        const response = await api.get(`/application/candidateInfo/ccs/files/${this.applicationId}/${id}`)
        return response.data
    }
    async getMemberIncomeStatus(id) {
        const response = await api.get(`/application/candidateInfo/income/status/${this.applicationId}/${id}`)
        const { bankAccountUpdated, IncomesUpdated, CCS_Updated } = response.data
        return { bank: bankAccountUpdated, income: IncomesUpdated, ccs: CCS_Updated }
    }
    async getDeclarations() {
        const response = await api.get(`/application/candidateInfo/declaration/${this.applicationId}`)
        return response.data.declarations?.map(e => ({ ...e, urls: removeObjectFileExtension(e.url) }))
    }
}

export default new ApplicationService()