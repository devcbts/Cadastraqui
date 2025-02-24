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
                NotificationService.error({ text: err?.response?.data?.message })
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
     * @typedef {Object} IEntityFile
     * @property {File} file  
     * @property {string} [type]  
     * @property {IMetadata} [metadata]
     * @property {Object} [fields]
      */


    /**
     * 
     * @param {Object} params
     * @param {IMetadata} params.metadata 
     * @param {IEntityFile[] | File | FileList} params.files
     * @param {string} params.type 
     * @param {Object} [params.fields] 
      */
    const handleUploadFile = async ({ files, metadata, fields, type }) => {
        try {
            console.log((Array.isArray(files) || files instanceof FileList) ? Array.from(files) : [files])
            // transform to an array of files
            const transformedFiles = (Array.isArray(files) || files instanceof FileList) ? Array.from(files) : [files]

            const formData = createLegalDocumentFormData({ files: transformedFiles, metadata, fields, type })
            console.log(formData)
            const response = await entityService.uploadLegalFile(formData)
            setDocuments(response.documents)
            NotificationService.success({ type: 'toast', text: 'Envio realizado com sucesso!' })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }

    return { documents, handleUploadFile }

}