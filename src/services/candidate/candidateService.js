import { api } from "../axios"

class CandidateService {
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