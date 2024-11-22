import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import commonStyles from '../../../styles.module.scss'
import { z } from "zod";
import FilePreview from "Components/FilePreview";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";

const { forwardRef, useEffect, useMemo } = require("react");

const IncomeFile = forwardRef(({ data, label, required }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: z.object({
            file_document: required ? z.instanceof(File, 'Arquivo obrigatório') : z.instanceof(File).nullish(),
            url_document: z.string().nullish(),

        }).superRefine((data, ctx) => {
            if (required && !data.file_document && !data.url_document) {
                ctx.addIssue({
                    message: 'Documento obrigatório',
                    path: ['file_document']
                })
            }
        }),
        defaultValues: {
            file_document: null,
            url_document: ''
        },
        initialData: data
    }, ref)
    useTutorial(INCOME_TUTORIALS.DOCUMENT[data?.incomeSource])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', maxWidth: '600px', placeSelf: 'center' }}>
            <FormFilePicker control={control} name={"file_document"} label={label ?? 'comprovante mensal de receitas brutas'} accept={"application/pdf"} />
            <FilePreview url={watch("url_document")} file={watch("file_document")} text={'ver documento'} />
        </div>

    )
})
export default IncomeFile