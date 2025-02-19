import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import FileCard from "../FileCard"
import { useLegalFiles } from "../useLegalFiles"

export default function ElectionRecord() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'ELECTION_RECORD' })

    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(File).nullish().refine((v) => !!v, { message: 'Arquivo obrigatório' }),
            start: z.string().min(1, 'Obrigatório').date('Data inválida'),
            end: z.string().min(1, 'Obrigatório').date('Data inválida'),
        }),
        defaultValues: {
            start: '',
            end: '',
            file: null
        }
    })
    const handleUpload = async () => {
        await handleUploadFile({
            file: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.ELECTION_RECORD,
            },
            fields: {
                start: getValues('start'),
                end: getValues('end')
            },
            type: ENTITY_LEGAL_FILE.ELECTION_RECORD,
        }).then(
            (_) => reset()
        )
    }
    return (
        <>
            {documents.length === 0 ? <strong>Nenhum documento</strong> :
                <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                    {documents.map((e, i) =>
                        <FileCard label={i === documents.length - 1
                            ? 'Vigente'
                            : 'Anterior'} url={e.url} />)
                    }
                </div>
            }
            <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                <InputForm type="date" control={control} label={'Início do mandato'} name={'start'} />
                <InputForm type="date" control={control} label={'Término do mandato'} name={'end'} />
                <FormFilePicker accept={'application/pdf'} label={'arquivo'} name={'file'} control={control} />
                <ButtonBase onClick={handleSubmit(handleUpload)} label={'enviar'} />
            </div>
        </>
    )
}