export default function createFileForm(data) {
    let metadataObject = {}
    const formData = new FormData()
    const files = Object.entries(data).filter(([key, value]) => {
        return key.startsWith('file_') && !!value
    })
    if (!files.length) return null
    files.forEach(([key, value]) => {
        const fileName = key.split('_')[1]
        // formData.append(key, value)
        if (data?.[`metadata_${fileName}`]) {
            metadataObject = Object.assign({ ...metadataObject }, { [`metadata_${fileName}`]: data?.[`metadata_${fileName}`] })
        }
    })
    formData.append("file_metadatas", JSON.stringify(metadataObject))
    files.forEach(([key, value]) => {
        formData.append(key, value)

    })


    return formData
}