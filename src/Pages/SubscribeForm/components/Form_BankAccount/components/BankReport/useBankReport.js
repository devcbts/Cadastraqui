import useSubscribeFormPermissions from "Pages/SubscribeForm/hooks/useSubscribeFormPermissions"
import { useEffect, useState } from "react"
import { NotificationService } from "services/notification"
import uploadService from "services/upload/uploadService"
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category"
import METADATA_FILE_TYPE from "utils/file/metadata-file-type"

export default function useBankReport({ id }) {
    const [isLoading, setIsLoading] = useState(true)
    const { canEdit, service } = useSubscribeFormPermissions()
    const [data, setData] = useState([])
    const [_needReload, _setNeedReload] = useState(false)
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
    }, [id, _needReload])

    const handleUploadFile = async (type, file) => {
        if (!canEdit) { return }
        try {
            const formData = new FormData()
            const suffix = `${date.getMonth() + 1}-${date.getFullYear()}-${type}`
            const fileName = `file_${suffix}`
            const currMonth = date.getMonth() + 1
            const currYear = date.getFullYear()
            const date = `${currYear}-${currMonth.toString().padStart(2, '0')}-01T00:00:00`
            const metadata = {
                [`metadata_${suffix}`]: {
                    type: type === "registrato" ? METADATA_FILE_TYPE.BANK.REGISTRATO : METADATA_FILE_TYPE.BANK.PIX,
                    category: METADATA_FILE_CATEGORY.Finance,
                    date
                }
            }
            formData.append("file_metadatas", JSON.stringify(metadata))
            formData.append(fileName, file)

            await uploadService.uploadBySectionAndId({ section: type, id }, formData)
            NotificationService.success({ text: 'Documento enviado com sucesso' })
            _setNeedReload(prev => !prev)
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar documento, tente novamente' })

        }

    }

    return {
        data, isLoading, handleUploadFile, readOnlyUser: !canEdit
    }
}