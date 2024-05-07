import { api } from "../axios"

class CandidateService {
    registerIdentityInfo(data) {
        const token = localStorage.getItem("token")
        return api.post("/candidates/identity-info", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }

    getIdentityInfo() {
        const token = localStorage.getItem("token")
        return api.get(`/candidates/identity-info`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new CandidateService()