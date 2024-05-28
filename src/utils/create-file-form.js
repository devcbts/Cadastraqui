export default function createFileForm(data) {
    const formData = new FormData()
    const files = Object.entries(data).filter(([key, _]) => {
        return key.startsWith('file_')
    })
    files.forEach(([key, value]) => formData.append(key, value))
    return formData
}