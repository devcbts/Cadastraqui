import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import FileCard from "../FileCard"
import { useLegalFiles } from "../useLegalFiles"

export default function CarePlan() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'CARE_PLAN' })

    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(File).nullish().refine((v) => !!v, { message: 'Arquivo obrigatório' }),
            expireAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
            issuedAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
        }),
        defaultValues: {
            file: null,
            expireAt: '',
            issuedAt: ''
        }
    })
    const handleUpload = async () => {
        await handleUploadFile({
            files: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.CARE_PLAN,
            },
            fields: {
                expireAt: getValues('expireAt'),
                issuedAt: getValues('issuedAt'),
            },
            type: ENTITY_LEGAL_FILE.CARE_PLAN,
        }).then(
            (_) => reset()
        )
    }
    return (
        <>
            {documents.length === 0 ? <strong>Nenhum documento</strong> :
                <div style={{ display: "grid", gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>

                    {documents.map((e, i) =>
                        <FileCard key={e.id} label={i === documents.length - 1
                            ? 'Vigente'
                            : 'Anterior'} url={e.url} />)
                    }
                </div>
            }
            <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                <label>Período de vigência da certificação a ser concedida</label>
                <InputForm control={control} name={'issuedAt'} label={'Início'} type="date" />
                <InputForm control={control} name={'expireAt'} label={'Término'} type="date" />
                <FormFilePicker accept={'application/pdf'} label={'arquivo'} name={'file'} control={control} />
                <ButtonBase onClick={handleSubmit(handleUpload)} label={'enviar'} />
            </div>
        </>
    )
}