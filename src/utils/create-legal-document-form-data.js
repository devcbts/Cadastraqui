/**
     * @typedef {Object} IMetadata
     * @property {METADATA_FILE_TYPE} [type]  
     * @property {METADATA_FILE_CATEGORY} [category]  
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
 * @param {IEntityFile[] | File[]} params.files
 * @param {string} params.type 
 * @param {Object} [params.fields] 
 * @param {string} params.group 
  */
export default function createLegalDocumentFormData({ files, metadata, fields, type, group }) {
    const formData = new FormData()
    console.log(files)
    files.forEach((file, index) => {
        const isEntityFile = !(file instanceof File)
        formData.append(`file_${index}`, isEntityFile ? file.file : file)
        formData.append(`metadata_${index}`, JSON.stringify({ ...file?.metadata ?? {}, ...metadata ?? {} }))
        formData.append(`type_${index}`, isEntityFile ? (file.type ?? type) : type)
        formData.append(`group_${index}`, isEntityFile ? (file.group ?? group) : group)
        if (file.fields || fields) {
            formData.append(`fields_${index}`, JSON.stringify(file.fields ?? fields))
        }

    });
    return formData
}