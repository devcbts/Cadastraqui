import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import useControlForm from "hooks/useControlForm"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import FileCard from "../FileCard"
import { useLegalFiles } from "../useLegalFiles"

export default function InternalRules() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'INTERNAL_RULES' })

    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(FileList).nullish().refine((v) => !!v?.length, { message: 'Arquivo obrigatório' }),

        }),
        defaultValues: {
            file: null,

        }
    })
    const handleUpload = async () => {
        await handleUploadFile({
            files: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.INTERNAL_RULES,
            },

            type: ENTITY_LEGAL_FILE.INTERNAL_RULES,
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