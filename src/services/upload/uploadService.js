const { api } = require("services/axios")

class UploadService {
    uploadBySectionAndId({ section, id }, data) {
        const token = localStorage.getItem('token')
        return api.post(`/candidates/upload/${section}/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }
}

export default new UploadService()