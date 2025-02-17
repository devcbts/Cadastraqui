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
export default function createLegalDocumentFormData({ file, metadata, fields, type, index = 0 }) {
    const formData = new FormData()
    formData.append(`file_${index}`, file)
    formData.append(`metadata_${index}`, JSON.stringify(metadata))
    formData.append(`type_${index}`, type)
    fields && formData.append(`fields_${index}`, JSON.stringify(fields))
    return formData
}