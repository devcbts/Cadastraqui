import { api } from "../axios"
import familyMemberMapper from "./mappers/family-member-mapper";
import identityInfoMapper from "./mappers/identity-info-mapper";

class CandidateService {
    registerIdentityInfo(data) {
        const token = localStorage.getItem("token")
        return api.post("/candidates/identity-info", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
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
        return api.delete('/candidates/family-member', { params: { id: id } }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
    registerFamilyMember(data) {
        const mappedData = familyMemberMapper.toPersistence(data)
        const token = localStorage.getItem("token")
        return api.post(`/candidates/family-member`, mappedData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
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
        return response.data.housingInfo
    }
    registerHousingInfo(data) {
        const token = localStorage.getItem("token")
        return api.post('/candidates/housing-info', data, {
            headers: {
                'authorization': `Bearer ${token}`,
            }
        })
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
    async getIdentityInfo() {
        const token = localStorage.getItem("token")
        const response = await api.get(`/candidates/identity-info`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        return identityInfoMapper.fromPersistence(response.data.identityInfo)
    }
}

export default new CandidateService()