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

export default function HealthFiles({ items }) {
    const { control, getValues, formState: { isValid }, trigger, resetField } = useControlForm({
        schema: healthFileSchema,
        defaultValues: {
            file_exam: null
        }
    })
    const [allFiles, setAllFiles] = useState(items)

    async function handleUpload() {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const value = getValues("file_exam")
            const formData = new FormData()
            const fileName = `file_laudo${new Date().getTime()}`
            formData.append(fileName, value)
            await uploadService.uploadBySectionAndId({ section: items?.type, id: items?.memberId, tableId: items?.id }, formData)
            setAllFiles((prev) => ({ ...prev, urls: { ...prev?.urls, [fileName]: URL.createObjectURL(value) } }))
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
            console.log(urls)
            setAllFiles((prev) => ({ ...prev, urls }))
            NotificationService.success({ text: 'Arquivo excluído' })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: 'Erro ao excluir arquivo' })
        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 'inherit', gap: '32px', alignItems: 'center' }}>
            <FormList.Root title={'Laudos'} text={items?.name}>
                <FormList.List text={'Nenhum laudo ou exame cadastrado'} list={Object.entries(allFiles?.urls)} render={(item) => (
                    <FormListItem.Root text={item?.[0].split('_')[1]}>
                        <FormListItem.Actions>
                            <Link to={item?.[1]} target="_blank">
                                <ButtonBase label={'baixar'} />
                            </Link>
                            <ButtonBase label={'excluir'} danger onClick={() => handleDelete(item?.[0].split('_')[1])} />
                        </FormListItem.Actions>
                    </FormListItem.Root>
                )}>

                </FormList.List>
            </FormList.Root>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FormFilePicker accept={'application/pdf'} control={control} name={"file_exam"} />
                <ButtonBase label={'cadastrar'} onClick={handleUpload} />
            </div>
        </div>
    )
}