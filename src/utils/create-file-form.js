export default function createFileForm(data) {
    const formData = new FormData()
    const files = Object.entries(data).filter(([key, value]) => {
        return key.startsWith('file_') && !!value
    })
    if (!files.length) return null
    files.forEach(([key, value]) => formData.append(key, value))

    return formData
}