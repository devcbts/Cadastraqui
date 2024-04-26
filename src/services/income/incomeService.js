import { api } from "../axios"

class IncomeService {
    async registerIncome(memberid, {
        employmentType,
        quantity,
        startDate,
        fantasyName,
        CNPJ,
        socialReason,
        financialAssistantCPF,
        admissionDate,
        position,
        payingSource,
        payingSourcePhone,
        receivesUnemployment,
        parcels,
        firstParcelDate,
        parcelValue }) {
        const token = localStorage.getItem("token")
        await api.post(`/candidates/family-member/CLT/${memberid}`,
            {
                employmentType,
                quantity,
                startDate,
                fantasyName,
                CNPJ,
                socialReason,
                financialAssistantCPF,
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                receivesUnemployment,
                parcels,
                firstParcelDate,
                parcelValue
            }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
}

export default new IncomeService()