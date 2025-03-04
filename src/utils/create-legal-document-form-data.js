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
    files?.forEach((file, index) => {
        const isEntityFile = !(file instanceof File)
        if (isEntityFile && !file.file) {
            return
        }
        const form = {
            file: isEntityFile ? file.file : file,
            metadata: { ...file?.metadata ?? {}, ...metadata ?? {} },
            type: isEntityFile ? (file.type ?? type) : type,
            group: isEntityFile ? (file.group ?? group) : group,
            fields: file.fields ?? fields
        }
        console.log('tyope', form)
        if (form.file) {
            formData.append(`file_${index}`, form.file)
        }
        if (form.metadata) {
            formData.append(`metadata_${index}`, JSON.stringify(form.metadata))
        }
        if (form.type) {
            formData.append(`type_${index}`, form.type)
        }
        if (form.group) {
            formData.append(`group_${index}`, form.group)
        }
        if (form.fields) {
            formData.append(`fields_${index}`, JSON.stringify(form.fields))
        }

    });
    return formData
}