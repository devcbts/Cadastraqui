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
     * @property {ENTITY_GROUP_TYPE} [document]  
      */
    /**
     * @typedef {Object} IEntityFile
     * @property {File} file  
     * @property {string} [type]  
     * @property {string} [group]
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
     * @param {string} [params.group] 
     * @param {string} [groupId] - If is uploading a group file individually - default is undefined
      */
    const handleUploadFile = async ({ files, metadata, fields, group, type }, groupId = undefined) => {
        try {
            console.log(files)
            // transform to an array of files
            const transformedFiles = (Array.isArray(files) || files instanceof FileList) ? Array.from(files) : [files]

            const formData = createLegalDocumentFormData({ files: transformedFiles, metadata, fields, type, group })
            const response = await entityService.uploadLegalFile(formData, groupId)
            setDocuments(response.documents)
            NotificationService.success({ type: 'toast', text: 'Envio realizado com sucesso!' })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handleUpdateFile = async ({ id, files, metadata, fields }) => {
        try {
            // transform to an array of files
            const transformedFiles = (Array.isArray(files) || files instanceof FileList) ? Array.from(files) : [files]

            const formData = createLegalDocumentFormData({ files: transformedFiles, metadata, fields, })
            const document = await entityService.updateLegalFile(id, formData)
            setDocuments((prev) => ([...prev].map(x => x.id === id ? document : x)))
            NotificationService.success({ type: 'toast', text: 'Documento alterado com sucesso!' })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }

    return { documents, handleUploadFile, handleUpdateFile }

}