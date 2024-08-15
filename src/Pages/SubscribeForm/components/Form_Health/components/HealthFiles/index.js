import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import useControlForm from "hooks/useControlForm"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import uploadService from "services/upload/uploadService"
import healthFileSchema from "./schemas/health-files-schema"
import { useRecoilState } from 'recoil'
import Loader from 'Components/Loader'
import removeObjectFileExtension from 'utils/remove-file-ext'
import METADATA_FILE_TYPE from 'utils/file/metadata-file-type'
import METADATA_FILE_CATEGORY from 'utils/file/metadata-file-category'
export default function HealthFiles({ items, edit = true, onBack }) {
    const { control, getValues, formState: { isValid }, trigger, resetField } = useControlForm({
        schema: healthFileSchema,
        defaultValues: {
            file_exam: null
        }
    })
    const [isLoading, setIsLoading] = useState(true)
    const [allFiles, setAllFiles] = useState(items)
    useEffect(() => {
        if (edit) {
            const fetchData = async () => {
                const urls = await candidateService.getHealthFiles(items.type, items.memberId, items.id)
                const deleteUrl = Object.keys(urls)[0]
                const mapped = removeObjectFileExtension(urls)
                setAllFiles((prev) => ({ ...prev, urls: mapped, deleteUrl }))
            }
            fetchData()
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }, [])
    async function handleUpload() {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const name = new Date().getTime()
            const additionalInfo = items.type === 'health'
                ? { disease: items.originalName }
                : { medication: items.name }
            const metadata = {
                [`metadata_laudo${name}`]: {
                    type: METADATA_FILE_TYPE.HEALTH.EXAM,
                    category: items.type === 'health' ? METADATA_FILE_CATEGORY.Disease : METADATA_FILE_CATEGORY.Medication,
                    ...additionalInfo
                }
            }
            const value = getValues("file_exam")
            const formData = new FormData()
            formData.append(`file_metadatas`, JSON.stringify(metadata))
            formData.append(`file_laudo${name}`, value)

            await uploadService.uploadBySectionAndId({ section: items?.type, id: items?.memberId, tableId: items?.id }, formData)
            setAllFiles((prev) => ({ ...prev, urls: { ...prev?.urls, [`file_laudo${name}`]: URL.createObjectURL(value) } }))
            resetField("file_exam")
        } catch (err) {
            NotificationService.error({ text: 'Erro ao realizar o upload do arquivo' })
        }
    }
    const handleDelete = async (name) => {
        try {
            await candidateService.deleteFile(`${allFiles?.deleteUrl}/${name}.pdf`)
            const urls = allFiles.urls
            delete urls[`url_${name}`]
            delete urls[`file_${name}`]

            setAllFiles((prev) => ({ ...prev, urls }))
            NotificationService.success({ text: 'Arquivo excluído' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao excluir arquivo' })
        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 'inherit', gap: '32px', alignItems: 'center' }}>
            <Loader loading={isLoading} />
            <FormList.Root title={'Laudos'} text={items?.name}>
                <FormList.List text={'Nenhum laudo ou exame cadastrado'} list={Object.entries(allFiles?.urls)} render={(item) => (
                    <FormListItem.Root text={item?.[0].split('_')[1]}>
                        <FormListItem.Actions>
                            <Link to={item?.[1]} target="_blank">
                                <ButtonBase label={'baixar'} />
                            </Link>
                            {edit && <ButtonBase label={'excluir'} danger onClick={() => handleDelete(item?.[0].split('_')[1])} />}
                        </FormListItem.Actions>
                    </FormListItem.Root>
                )}>

                </FormList.List>
            </FormList.Root>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '80%', alignItems: 'center' }}>
                {edit && <FormFilePicker accept={'application/pdf'} control={control} name={"file_exam"} />}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 'inherit' }}>
                    <ButtonBase onClick={onBack}>
                        <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                    {edit && <ButtonBase label={'cadastrar'} onClick={handleUpload} />}
                </div>
            </div>
        </div>
    )
}