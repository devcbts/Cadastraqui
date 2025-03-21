import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import useControlForm from "hooks/useControlForm"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import FileCard from "../FileCard"
import { useLegalFiles } from "../useLegalFiles"

export default function SocialStatus() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'SOCIAL_STATUS' })

    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(FileList).nullish().refine((v) => !!v?.length, { message: 'Arquivo(s) obrigatório(s)' }),
        }),
        defaultValues: {
            file: null
        }
    })
    const handleUpload = async () => {
        await handleUploadFile({
            files: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.SOCIAL_STATUS,
            },

            type: ENTITY_LEGAL_FILE.SOCIAL_STATUS,
        }).then(
            (_) => reset()
        )
    }
    return (
        <>
            {documents.length === 0 ? <strong>Nenhum documento</strong> :
                <div style={{ display: "grid", gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>

                    {documents.map((e, i) =>
                        <FileCard key={e.id} label={'Arquivo'} url={e.url} />)
                    }
                </div>
            }
            <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                <FormFilePicker accept={'application/pdf'} label={'arquivo'} name={'file'} control={control} multiple />
                <ButtonBase onClick={handleSubmit(handleUpload)} label={'enviar'} />
            </div>
        </>
    )
}