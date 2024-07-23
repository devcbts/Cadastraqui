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
        return { ...response.data.candidate, fullName: response?.data?.candidate?.name, birthDate: response.data?.candidate?.birthDate?.split('T')?.[0] }
    }

    async uploadProfilePicture(img) {
        const token = localStorage.getItem("token")
        const response = await api.post("/candidates/profilePicture", img, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return response.data.url
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
    async getFamilyMembers({ includeSelf } = { includeSelf: false }) {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/family-member?includeSelf=${includeSelf}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return {
            members: response.data.familyMembers?.map(e => familyMemberMapper.fromPersistence(e)),
            livesAlone: response.data.livesAlone
        }
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
        return {
            vehicles: vehicleMapper.fromPersistence(response.data.vehicleInfoResults),
            hasVehicles: response?.data?.hasVehicles
        }
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
    async registerEmploymentType(id, data) {
        const token = localStorage.getItem("token")
        const mappedData = employementTypeMapper.toPersistence(data)
        const response = await api.post(`/candidates/family-member/employmentType/${id}`, mappedData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return response.data.id
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

        return { monthlyIncome, info: memberIncome.incomes?.find(e => e.id === id).months, data: memberIncome.incomes?.find(e => e.id === id) }
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
    async registerMedicationInfo(id, data) {
        const token = localStorage.getItem("token")
        const response = await api.post(`/candidates/medication-info/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return response.data.id
    }
    async getBankingAccountById(id) {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/bank-info/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        return {
            accounts: bankAccountMapper.fromPersistence(response.data),
            hasBankAccount: response.data.hasBankAccount,
            isUser: response.data.isUser,
        }
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
        return api.post(`/candidates/application/${announcementId}/${courseId}/${candidateId}`)
    }

    async getExpenses(id = '') {
        const response = await api.get(`/candidates/expenses/${id}`)
        return expenseMapper.fromPersistence(response.data)
    }

    async registerExpenses(data) {
        const response = await api.post('/candidates/expenses', data)
        return expenseMapper.fromPersistence(response.data)
    }

    async getProgress() {
        const response = await api.get('/candidates/progress')
        return progressMapper.fromPersistence(response.data)
    }
    async getRegistrato(id) {
        const response = await api.get(`/candidates/registrato/${id}`)
        const data = removeObjectFileExtension(response.data)
        // get the newest registrato (TODO: remove the last one when new is uploaded)
        const [date, url] = Object.entries(data)?.sort((a, b) => a < b)[0]
        const [month, year] = date.split('_')[1].split('-')
        const registrato_date = new Date(`${month}-01-${year}`)
        return { url, date: registrato_date }
    }

    deleteFile(path) {
        return api.post('/candidates/document/delete', { path })
    }

    register(data) {
        return api.post('/candidates/', data)
    }
    registerResponsible(data) {
        return api.post('/responsibles', data)
    }
    async getAnnouncementPdf(id) {
        const response = await api.get(`/candidates/documents/announcement/${id}`)
        return response.data.url
    }
    async getDashboard() {
        const response = await api.get(`/candidates/dashboard`)
        return response.data
    }
    async getCandidateSolicitations() {
        const response = await api.get(`/candidates/solicitation/`)
        return response.data.solicitations
    }
    async getCandidateSolicitationByApplication(applicationId) {
        const response = await api.get(`/candidates/solicitation/${applicationId}`)
        return response.data.solicitations
    }
    async deleteIncome(incomeId, memberId) {
        return api.delete(`/candidates/income/${incomeId}/${memberId}`)
    }
    async deleteVehicle(vehicleId) {
        return api.delete(`/candidates/vehicle-info/${vehicleId}`)
    }
    async updateRegistrationProgress(section, status) {
        return api.patch(`/candidates/progress/${section}`, { status })
    }
    async updateIncome(memberId, data) {
        const response = await api.put(`/candidates/update-income/${memberId}`, data)
        return response.data
    }
    async getInfoForDeclaration() {
        const response = await api.get(`/candidates/declaration/get-info`)
        return response.data.userInfo
    }
    async registerDeclaration({ section, id, data }) {
        return api.post(`/candidates/declaration/${section}/${id}`, data)
    }
    async deleteDeclaration({ userId, type } = {
        userId: '',
        type: "Form" ||
            "Activity" ||
            "AddressProof" ||
            "Autonomo" ||
            "Card" ||
            "ChildPension" ||
            "ChildSupport" ||
            "ContributionStatement" ||
            "Data" ||
            "Empresario" ||
            "InactiveCompany" ||
            "IncomeTaxExemption" ||
            "MEI" ||
            "NoAddressProof" ||
            "Penseion" ||
            "Pension" ||
            "Rent" ||
            "RentDetails" ||
            "RentIncome" ||
            "RentedHouse" ||
            "RuralWorker" ||
            "SingleStatus" ||
            "StableUnion" ||
            "Status" ||
            "WorkCard"
    }
    ) {
        await api.post(`/candidates/declaration/${type}/${userId}`, {
            text: null,
            declarationExists: false
        })
    }

    async getHealthFiles(type, memberId, id) {
        const response = await api.get(`/candidates/health-files/${type}/${memberId}/${id}`)
        return response.data.urls
    }
}

export default new CandidateService()