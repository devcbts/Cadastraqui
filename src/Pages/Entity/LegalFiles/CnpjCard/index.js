import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import useControlForm from "hooks/useControlForm"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import FileCard from "../FileCard"
import { useLegalFiles } from "../useLegalFiles"

export default function CnpjCard() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'ID_CARD' })

    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(File).nullish().refine((v) => !!v, { message: 'Arquivo obrigatório' })
        }),
        defaultValues: {
            file: null
        }
    })
    const handleUpload = async () => {
        await handleUploadFile({
            files: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.ID_CARD,
            },
            type: ENTITY_LEGAL_FILE.ID_CARD,
        }).then(
            (_) => reset()
        )
    }
    return (
        <div>
            {documents.length === 0 ? <strong>Nenhum documento</strong> :
                <div style={{ display: "grid", gridTemplateColumns: '1fr', gap: 16 }}>

                    {documents.map((e, i) =>
                        <FileCard key={e.id} label={'Arquivo'} url={e.url} />)
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