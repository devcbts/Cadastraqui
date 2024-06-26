import removeObjectFileExtension from "utils/remove-file-ext"

class ResumeMapper {
    fromPersistence(data) {
        const { interviewDocument, visitDocument, majoracao } = data
        const getDate = (v) => new Date(v?.split('_')[1]?.split('.')?.[0])
        const mapped = () => {
            let interview = null;
            let visit = null;
            let maj = null
            if (Object.keys(interviewDocument).length) {
                const a = removeObjectFileExtension(interviewDocument)
                const aDate = getDate(Object.keys(a)?.[0])
                interview = {
                    date: aDate,
                    file: Object.values(a)[0]
                }

            }
            if (Object.keys(visitDocument).length) {
                const b = removeObjectFileExtension(visitDocument)
                const bDate = getDate(Object.keys(b)?.[0])
                visit = {
                    date: bDate,
                    file: Object.values(b)[0]
                }
            }
            if (Object.keys(majoracao).length) {
                maj = removeObjectFileExtension(majoracao)["url_majoracao"]
            }
            console.log(maj)
            return {
                interview, visit, majoracao: maj
            }
        }
        return {
            ...data,
            ...mapped()
        }
    }
}

export default new ResumeMapper()