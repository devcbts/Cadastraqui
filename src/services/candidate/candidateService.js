import removeObjectFileExtension from "utils/remove-file-ext";
import { api } from "../axios"
import announcementMapper from "./mappers/announcement-mapper";
import applicantsMapper from "./mappers/applicants-mapper";
import bankAccountMapper from "./mappers/bank-account-mapper";
import employementTypeMapper from "./mappers/employement-type-mapper";
import expenseMapper from "./mappers/expense-mapper";
import familyMemberMapper from "./mappers/family-member-mapper";
import habitationMapper from "./mappers/habitation-mapper";
import healthInfoMapper from "./mappers/health-info-mapper";
import identityInfoMapper from "./mappers/identity-info-mapper";
import incomeMapper from "./mappers/income-mapper";
import progressMapper from "./mappers/progress-mapper";
import vehicleMapper from "./mappers/vehicle-mapper";

class CandidateService {
    async getBasicInfo() {
        const token = localStorage.getItem("token")
        const response = await api.get('/candidates/basic-info', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return response.data.candidate
    }

    uploadProfilePicture(img) {
        const token = localStorage.getItem("token")
        return api.post("/candidates/profilePicture", img, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    async registerIdentityInfo(data) {
        const token = localStorage.getItem("token")
        const response = await api.post("/candidates/identity-info", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        return response.data.id
    }
    updateIdentityInfo(data) {
        const token = localStorage.getItem("token")
        return api.patch("/candidates/identity-info", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
    async getFamilyMembers() {
        const token = localStorage.getItem("token")
        const response = await api.get('/candidates/family-member', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return response.data.familyMembers?.map(e => familyMemberMapper.fromPersistence(e))
    }
    deleteFamilyMember(id) {
        const token = localStorage.getItem("token")
        return api.delete('/candidates/family-member', {
            params: { id }, headers: {
                authorization: `Bearer ${token}`,
            }
        })
    }
    async registerFamilyMember(data) {
        const mappedData = familyMemberMapper.toPersistence(data)
        const token = localStorage.getItem("token")
        const response = await api.post(`/candidates/family-member`, mappedData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return response.data.id
    }
    updateFamilyMember(id, data) {
        const mappedData = familyMemberMapper.toPersistence(data)
        const token = localStorage.getItem("token")
        return api.patch(`/candidates/family-info/${id}`, mappedData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    async getHousingInfo() {
        const token = localStorage.getItem("token")
        const response = await api.get("/candidates/housing-info", {
            headers: {
                'authorization': `Bearer ${token}`,
            }
        })

        return habitationMapper.fromPersistence(response.data)
    }
    async registerHousingInfo(data) {
        const token = localStorage.getItem("token")
        const response = await api.post('/candidates/housing-info', data, {
            headers: {
                'authorization': `Bearer ${token}`,
            }
        })
        return response.data.id
    }

    updateHousingInfo(data) {
        const token = localStorage.getItem("token")
        return api.patch("/candidates/housing-info", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async getVehicle() {
        const token = localStorage.getItem("token")
        const response = await api.get('/candidates/vehicle-info', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return vehicleMapper.fromPersistence(response.data.vehicleInfoResults)
    }

    registerVehicle(data) {
        const token = localStorage.getItem("token")
        return api.post('/candidates/vehicle-info', data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
    }
    updateVehicle(id, data) {
        const token = localStorage.getItem("token")
        return api.patch(`/candidates/vehicle-info/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
    }
    async getIdentityInfo() {
        const response = await api.get(`/candidates/identity-info`);
        return identityInfoMapper.fromPersistence({ ...response.data, urls: response.data.urls })
    }
    async getMonthlyIncome(id) {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/family-member/monthly-income/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return incomeMapper.fromPersistence(response.data.incomeBySource)
    }

    updateIncomeSource(data) {
        const token = localStorage.getItem("token")
        return api.post(`/candidates/update-income-source`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }

    registerMonthlyIncome(id, data) {
        const token = localStorage.getItem("token")
        return api.post(`/candidates/family-member/income/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    registerEmploymentType(id, data) {
        const token = localStorage.getItem("token")
        const mappedData = employementTypeMapper.toPersistence(data)
        return api.post(`/candidates/family-member/employmentType/${id}`, mappedData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    async getAllIncomes() {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/family-member/income`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return employementTypeMapper.fromPersistence(response.data)
    }

    async getMemberIncomeInfo(id) {
        const token = localStorage.getItem("token")
        const monthlyIncome = await this.getMonthlyIncome(id)
        const memberIncome = await this.getAllIncomes()
        return { monthlyIncome, info: memberIncome.incomes?.find(e => e.id === id).months }
    }

    async getHealthInfo() {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/health-info`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return healthInfoMapper.fromPersistence(response.data.healthInfoResultsWithUrls)
    }

    registerHealthInfo(id, data) {
        const token = localStorage.getItem("token")
        const mappedData = healthInfoMapper.toPersistence(data)
        return api.post(`/candidates/health-info/${id}`, mappedData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    registerMedicationInfo(id, data) {
        const token = localStorage.getItem("token")
        return api.post(`/candidates/medication-info/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    async getBankingAccountById(id) {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/bank-info/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return bankAccountMapper.fromPersistence(response.data)
    }
    async registerBankingAccount(id = '', data) {
        const response = await api.post(`/candidates/bank-info/${id}`, data)
        return response.data.id
    }
    updateBankingAccount(id, data) {
        return api.patch(`/candidates/bank-info/${id}`, data)
    }
    removeBankingAccount(id) {
        const _id = id
        return api.delete(`/candidates/bank-info/${_id}`)
    }
    async getAnnouncementById(id) {
        const response = await api.get(`/candidates/announcements/${id}`)
        return announcementMapper.fromPersistence(response.data)
    }
    async getCandidateAnnouncements() {
        const response = await api.get(`/candidates/announcements/`)
        return response.data.announcements
    }
    saveAnnouncement(id) {
        return api.post(`/candidates/announcement/save/${id}`)
    }
    async getAvailableApplicants() {
        const response = await api.get(`/candidates/applicants`)
        return applicantsMapper.fromPersistence(response.data)
    }
    applyAnnouncement({ announcementId, courseId, candidateId = '' }) {
        return api.post(`/candidates/application`, {
            announcement_id: announcementId,
            educationLevel_id: courseId,
            candidate_id: candidateId
        })
    }

    async getExpenses(id = '') {
        const response = await api.get(`/candidates/expenses/${id}`)
        return expenseMapper.fromPersistence(response.data)
    }

    registerExpenses(data) {
        return api.post('/candidates/expenses', data)
    }

    async getProgress() {
        const response = await api.get('/candidates/progress')
        return progressMapper.fromPersistence(response.data)
    }
    async getRegistrato(id) {
        const response = await api.get(`/candidates/registrato/${id}`)
        const data = removeObjectFileExtension(response.data)
        const [date, url] = Object.entries(data)[0]
        const [month, year] = date.split('_')[1].split('-')
        const registrato_date = new Date(`${month}-01-${year}`)
        return { url, date: registrato_date }
    }

    deleteFile(path) {
        return api.post('/candidates/document/delete', { path })
    }
}

export default new CandidateService()