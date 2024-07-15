const { api } = require("services/axios")

class UploadService {
    uploadBySectionAndId({ section, id, tableId = '' }, data) {
        if (!data) return
        const token = localStorage.getItem('token')
        return api.post(`/candidates/upload/${section}/${id}/${tableId}`, data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }
    uploadSolicitation({ type, applicationId }, data) {
        return api.post(`/assistant/documents/solicitation/${type}/${applicationId}`, data)
    }
    uploadCandidateSolicitation(solicitationId, file) {
        return api.post(`/candidates/upload/${solicitationId}`, file)
    }

}

export default new UploadService()