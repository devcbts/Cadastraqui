import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import commonStyles from '../../../styles.module.scss'
import { z } from "zod";
import FilePreview from "Components/FilePreview";

const { forwardRef, useEffect, useMemo } = require("react");

const IncomeFile = forwardRef(({ data, label, required }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: z.object({
            file_document: required ? z.instanceof(File, 'Arquivo obrigatório') : z.instanceof(File).nullish()
        }),
        defaultValues: {
            file_document: null,
            url_document: ''
        },
        initialData: data
    }, ref)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', alignItems: 'center' }}>
            <FormFilePicker control={control} name={"file_document"} label={label ?? 'comprovante mensal de receitas brutas'} accept={"application/pdf"} />
            <FilePreview url={watch("url_document")} file={watch("file_document")} text={'ver documento'} />
        </div>

    )
})
export default IncomeFile