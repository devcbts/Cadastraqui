import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import useControlForm from "hooks/useControlForm"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import FileCard from "../FileCard"
import { useLegalFiles } from "../useLegalFiles"

export default function ResponsibleCpf() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'RESPONSIBLE_CPF' })
    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(File).nullish().refine((v) => !!v, { message: 'Arquivo obrigatório' })
        }),
        defaultValues: {
            file: null
        }
    })
    const orderedDocuments = documents.sort((a, b) => a.createdAt > b.createdAt)
    const handleUpload = async () => {
        await handleUploadFile({
            file: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.RESPONSIBLE_CPF,
            },
            type: ENTITY_LEGAL_FILE.RESPONSIBLE_CPF,
        }).then(
            (_) => reset()
        )
    }
    return (
        <div>
            {documents.length === 0 ? <strong>Sem documentos anexados</strong> :
                <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                    {orderedDocuments.map((e, i) =>
                        <FileCard label={
                            i === orderedDocuments.length - 1
                                ? 'Vigente'
                                : 'Anterior'
                        } url={e.url} />)
                    }
                </div>
            }
            <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                <FormFilePicker accept={'application/pdf'} label={'Novo arquivo'} name={'file'} control={control} />
                <ButtonBase label={'enviar'} onClick={handleSubmit(handleUpload)} />
            </div>
        </div>
    )
}