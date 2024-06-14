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
}

export default new UploadService()