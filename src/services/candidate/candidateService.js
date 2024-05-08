import { api } from "../axios"
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