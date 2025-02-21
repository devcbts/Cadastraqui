import CustomFilePicker from "Components/CustomFilePicker"
import useControlForm from "hooks/useControlForm"
import { useMemo } from "react"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import { useLegalFiles } from "../useLegalFiles"
/**
 * 
 * @param {Object} props 
 * @param {string} props.type 
 * @param {import("utils/create-legal-document-form-data").IMetadata} [props.metadata] 
 * @param {number} [props.count] -  default value is 4
 * @returns 
 */
export default function YearUpload({
    count = 4,
    type
}) {
    const { documents, handleUploadFile } = useLegalFiles({ type: type })

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
                type: ENTITY_LEGAL_FILE[type],
            },
            fields: {
                year
            },
            type: ENTITY_LEGAL_FILE[type],
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
                {years.map((e, i) => (
                    <CustomFilePicker key={e} onUpload={(files) => handleUpload(files, e)} >
                        {/* <FileCard className={styles.uploadCard} label={e} url={documents.find(x => x.fields.year === e)?.url ?? ''} /> */}
                    </CustomFilePicker>
                ))}
            </div>
        </>
    )
}
