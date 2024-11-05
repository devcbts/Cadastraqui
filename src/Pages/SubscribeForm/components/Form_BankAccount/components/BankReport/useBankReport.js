import useAuth from "hooks/useAuth"
import useSubscribeFormPermissions from "Pages/SubscribeForm/hooks/useSubscribeFormPermissions"
import { useEffect, useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import applicationService from "services/application/applicationService"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import uploadService from "services/upload/uploadService"
import ROLES from "utils/enums/role-types"
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category"
import METADATA_FILE_TYPE from "utils/file/metadata-file-type"

export default function useBankReport({ id }) {
    const [isLoading, setIsLoading] = useState(true)
    const { canEdit, service } = useSubscribeFormPermissions()
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchCCSFiles = async () => {
            try {
                setIsLoading(true)
                const files = await service?.getCCSFiles(id)
                setData(files)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchCCSFiles()
    }, [id])

    const handleUploadFile = async (type, file) => {
        if (!canEdit) { return }
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
        data, isLoading, handleUploadFile, readOnlyUser: !canEdit
    }
}