import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import createLegalDocumentFormData from "utils/create-legal-document-form-data";

export function useLegalFiles({
    type
}) {
    const [documents, setDocuments] = useState([])

    useEffect(() => {

        const fetch = async () => {
            try {
                const response = await entityService.getLegalFiles(type)
                setDocuments(response.documents)
            } catch (err) {
                NotificationService.error({ text: err.response.data.message })
            }
        }
        fetch()
    }, [])
    /**
     * @typedef {Object} IMetadata
     * @property {METADATA_FILE_TYPE} [type]  
     * @property {METADATA_FILE_CATEGORY} [category]  
      */
    /**
     * 
     * @param {Object} params
     * @param {IMetadata } params.metadata 
     * @param {File} params.file 
     * @param {string} params.type 
     * @param {Object} [params.fields] 
      */
    const handleUploadFile = async ({ file, metadata, fields = null, type }) => {
        try {
            const formData = createLegalDocumentFormData({ file, metadata, fields, type })
            const response = await entityService.uploadLegalFile(formData)
            setDocuments(response.documents)
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
    }

    return { documents, handleUploadFile }

}