import moneyInputMask from "Components/MoneyFormInput/money-input-mask"
import { api } from "services/axios"
import EDUCATION_STYLES from "utils/enums/education-style-types"
import GENDER from "utils/enums/gender"
import findLabel from "utils/enums/helpers/findLabel"
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer"
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type"
import { STUDENT_RENEW_TRANSLATION } from "utils/enums/student-renew-status"
import { STUDENT_SCHOLARSHIP_TRANSLATION } from "utils/enums/student-scholarship-status"
import { formatCPF } from "utils/format-cpf"
import formatDate from "utils/format-date"

class StudentService {
    async getStudentsDashboard() {
        const response = await api.get(`/students/dashboard`)
        return response.data
    }
    async registerNewStudents(file) {
        const response = await api.post('/students/register', file)
        return response.data.students
    }
    async getAllStudents() {
        const response = await api.get(`/students/all`)
        return response.data
    }

    async getRenewCourses() {
        const response = await api.get(`/students/renew/courses`)
        return response.data.courses
    }
    async getRenewDashboard() {
        const response = await api.get(`/students/renew/dashbaord`)
        return response.data
    }

    async getStudentInformation(studentId) {
        const response = await api.get(`/students/information/${studentId}`)
        const {
            scholarshipInfo,
            courseInfo,
            documentInfo,
            personalInfo,
            familyInfo,
            incomeInfo
        } = response.data
        return {
            scholarshipInfo: {
                ...scholarshipInfo,
                isPartial: scholarshipInfo.isPartial ? 'Parcial' : 'Integral',
                admission: formatDate(scholarshipInfo.admission),
                scholarshipType: findLabel(SCHOLARSHIP_TYPE.concat(SCHOLARSHIP_OFFER), scholarshipInfo.scholarshipType),
                scholarshipStatus: STUDENT_SCHOLARSHIP_TRANSLATION[scholarshipInfo.scholarshipStatus],
                renewStatus: STUDENT_RENEW_TRANSLATION[scholarshipInfo.renewStatus],
            },
            courseInfo: { ...courseInfo, modality: findLabel(EDUCATION_STYLES, courseInfo.modality) },
            documentInfo: {
                ...documentInfo,
                isUpdated:
                    documentInfo.isUpdated === null
                        ? 'Desatualizados'
                        : (documentInfo.isUpdated ? 'Atualizados' : 'Pendentes'),
                lastUpdate: !documentInfo.lastUpdate ? 'Sem data' : formatDate(documentInfo?.lastUpdate)
            },
            personalInfo: {
                ...personalInfo,
                birthDate: formatDate(personalInfo.birthDate),
                CPF: formatCPF(personalInfo.CPF),
                gender: findLabel(GENDER, personalInfo.gender)
            },
            familyInfo,
            incomeInfo: {
                ...incomeInfo,
                expenses: moneyInputMask(incomeInfo.expenses),
                averageIncome: moneyInputMask(incomeInfo.averageIncome),
                status: incomeInfo.status === null ? 'Desatualizada' : (incomeInfo.status ? 'Atualizada' : 'Pendente'),
            }
        }
    }
    async getStudentInterviews(candidateId) {
        const response = await api.get(`students/interviews/${candidateId}`)
        return response.data.interviews
    }
    async getStudentRenewAnnouncements(candidateId) {
        const response = await api.get(`students/announcements/${candidateId}`)
        return response.data.announcements
    }
    createOrUpdateObservation({
        studentId,
        richText,
        plainText
    }) {
        return api.put(`students/observation`, {
            student_id: studentId,
            richText,
            plainText

        })
    }
    uploadDocument(studentId, formData) {
        return api.post(`students/upload/${studentId}`, formData)
    }
    async getEmails(studentId) {
        const response = await api.get(`students/emails/${studentId}`)
        return response.data.emails
    }
}

export default new StudentService()