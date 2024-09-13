const { api } = require("services/axios")

class UploadService {
    async uploadBySectionAndId({ section, id, tableId = '' }, data) {
        if (!data) return
        const token = localStorage.getItem('token')
        const response = await api.post(`/candidates/upload/${section}/${id}/${tableId}`, data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        return response.data.deleteUrl
    }
    uploadSolicitation({ type, applicationId }, data) {
        return api.post(`/assistant/documents/solicitation/${type}/${applicationId}`, data)
    }
    uploadCandidateSolicitation(solicitationId, file) {
        return api.post(`/candidates/upload/${solicitationId}`, file)
    }
    uploadMemberDocumentToSign({ section, id, tableId = '' }, data) {
        if (!data) {
            return
        }
        return api.post(`/candidates/post-pdf/${section}/${id}/${tableId}`, data)
    }

}

export default new UploadService()