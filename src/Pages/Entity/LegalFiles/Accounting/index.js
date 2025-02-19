import useControlForm from "hooks/useControlForm"
import { useMemo } from "react"
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
    const handleUpload = async (files, year) => {
        await handleUploadFile({
            files: files,
            metadata: {
                type: ENTITY_LEGAL_FILE.ACCOUNTING,
            },
            fields: {
                year
            },
            type: ENTITY_LEGAL_FILE.ACCOUNTING,
        }).then(
            (_) => reset()
        )
    }
    const years = useMemo(() => {
        const currYear = new Date().getFullYear()

        return Array.from({ length: 4 }).map((_, i) => currYear - i)
    }, [])
    return (
        <>

            <div style={{ display: "grid", gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>

                {years.map((e, i) =>
                    <UploadCard key={e} label={e} url={
                        documents.find(x => x.fields.year === e)?.url
                    } onUpload={(f) => handleUpload(f, e)} />)
                }
            </div>
        </>
    )
}