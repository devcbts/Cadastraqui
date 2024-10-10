import useAuth from "hooks/useAuth"
import candidateViewAtom from "Pages/SocialAssistant/SelectionProcess/CandidateView/atom/candidateViewAtom"
import { useEffect, useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import uploadService from "services/upload/uploadService"
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category"
import METADATA_FILE_TYPE from "utils/file/metadata-file-type"

export default function useBankReport({ id }) {
    const [isLoading, setIsLoading] = useState(true)
    const { auth } = useAuth()
    const { currentApplication } = useRecoilValue(candidateViewAtom)
    const isAssistant = useMemo(() => auth.role === "ASSISTANT")
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchCCSFiles = async () => {
            try {
                setIsLoading(true)
                const files =
                    isAssistant
                        ? await socialAssistantService.getCCSFiles(currentApplication, id)
                        : await candidateService.getCCSFiles(id)
                setData(files)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchCCSFiles()
    }, [id])

    const handleUploadFile = async (type, file) => {
        if (isAssistant) { return }
        try {
            const formData = new FormData()
            const date = new Date()
            const suffix = `${date.getMonth() + 1}-${date.getFullYear()}-${type}`
            const fileName = `file_${suffix}`
            const metadata = {
                [`metadata_${suffix}`]: {
                    type: type === "registrato" ? METADATA_FILE_TYPE.BANK.REGISTRATO : METADATA_FILE_TYPE.BANK.PIX,
                    category: METADATA_FILE_CATEGORY.Finance,
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-01T00:00:00`
                }
            }
            formData.append("file_metadatas", JSON.stringify(metadata))
            formData.append(fileName, file)

            await uploadService.uploadBySectionAndId({ section: type, id }, formData)
            NotificationService.success({ text: 'Documento enviado com sucesso' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar documento, tente novamente' })

        }

    }

    return {
        data, isLoading, handleUploadFile, isAssistant
    }
}