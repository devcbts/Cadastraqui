import useControlForm from "hooks/useControlForm"
import { useRef } from "react"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import UploadCard from "../FileCard/UploadCard"
import { useLegalFiles } from "../useLegalFiles"

export default function Accounting() {
    const { documents, handleUploadFile } = useLegalFiles({ type: 'ACCOUNTING' })

    const { control, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            file: z.instanceof(File).nullish().refine((v) => !!v, { message: 'Arquivo obrigatório' }),

        }),
        defaultValues: {
            file: null,

        }
    })
    const handleUpload = async () => {
        await handleUploadFile({
            files: getValues('file'),
            metadata: {
                type: ENTITY_LEGAL_FILE.ACCOUNTING,
            },
            type: ENTITY_LEGAL_FILE.ACCOUNTING,
        }).then(
            (_) => reset()
        )
    }
    const fileRef = useRef(null)
    return (
        <>
            <input type="file" hidden ref={fileRef} />
            <div style={{ display: "grid", gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>

                {[2024, 2025, 123234].map((e, i) =>
                    <UploadCard key={e} label={e} url={''} onClick={() => console.log(e)} />)
                }
            </div>

            {/* <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                <FormFilePicker accept={'application/pdf'} label={'arquivo'} name={'file'} control={control} />
                <ButtonBase onClick={handleSubmit(handleUpload)} label={'enviar'} />
            </div> */}
        </>
    )
}