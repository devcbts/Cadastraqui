import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import commonStyles from '../../../styles.module.scss'
import { z } from "zod";
import FilePreview from "Components/FilePreview";
import metadataSchema from "utils/file/metadata-schema";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";

const { forwardRef, useEffect, useMemo } = require("react");

const MultiIncomeFile = forwardRef(({ data }, ref) => {
    const getDate = useMemo(() => {
        if (!data) return ''
        const str = new Date(data?.date?.toString()).toISOString()
        const date = str.split('T')?.[0]

        return `${date}T00:00:00`
    }, [data])
    const [year, month] = getDate?.split('T')?.[0]?.split('-')

    const { control, watch, setValue } = useControlForm({
        schema: z.object({
            [`file_proLabore-${month}-${year}`]: z.instanceof(File).nullish(),
            [`file_dividends-${month}-${year}`]: z.instanceof(File).nullish(),
            [`file_decore-${month}-${year}`]: z.instanceof(File).nullish(),
            [`url_proLabore-${month}-${year}`]: z.string().nullish(),
            [`url_dividends-${month}-${year}`]: z.string().nullish(),
            [`url_decore-${month}-${year}`]: z.string().nullish(),
            [`metadata_proLabore-${month}-${year}`]: metadataSchema,
            [`metadata_dividends-${month}-${year}`]: metadataSchema,
            [`metadata_decore-${month}-${year}`]: metadataSchema,
        }).superRefine((data, ctx) => {
            if (!data?.[`file_proLabore-${month}-${year}`] && !data?.[`url_proLabore-${month}-${year}`]) {
                ctx.addIssue({
                    message: 'Arquivo obrigatório',
                    path: [`file_proLabore-${month}-${year}`]
                })
            }
            if (!data?.[`file_dividends-${month}-${year}`] && !data?.[`url_dividends-${month}-${year}`]) {
                ctx.addIssue({
                    message: 'Arquivo obrigatório',
                    path: [`file_dividends-${month}-${year}`]
                })
            }
            // if (!data?.[`file_decore-${month}-${year}`] && !data?.[`url_decore-${month}-${year}`]) {
            //     ctx.addIssue({
            //         message: 'Arquivo obrigatório',
            //         path: [`file_decore-${month}-${year}`]
            //     })
            // }
        }),
        defaultValues: {
            [`file_proLabore-${month}-${year}`]: null,
            [`file_dividends-${month}-${year}`]: null,
            [`file_decore-${month}-${year}`]: null,
            [`url_proLabore-${month}-${year}`]: '',
            [`url_dividends-${month}-${year}`]: '',
            [`url_decore-${month}-${year}`]: '',
            [`metadata_proLabore-${month}-${year}`]: { type: METADATA_FILE_TYPE.BANK.PROLABORE, category: METADATA_FILE_CATEGORY.Finance, date: getDate },
            [`metadata_dividends-${month}-${year}`]: { type: METADATA_FILE_TYPE.BANK.DIVIDENDS, category: METADATA_FILE_CATEGORY.Finance, date: getDate },
            [`metadata_decore-${month}-${year}`]: { type: METADATA_FILE_TYPE.BANK.DECORE, category: METADATA_FILE_CATEGORY.Finance, date: getDate },
        },
        initialData: data
    }, ref)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
                <FormFilePicker control={control} name={`file_proLabore-${month}-${year}`} label={'Pró-labore'} accept={"application/pdf"} />
                <FilePreview url={watch(`url_proLabore-${month}-${year}`)} file={watch(`file_proLabore-${month}-${year}`)} text={'ver documento'} />
            </div>
            <div style={{ width: '100%' }}>
                <FormFilePicker control={control} name={`file_dividends-${month}-${year}`} label={'Dividendos'} accept={"application/pdf"} />
                <FilePreview url={watch(`url_dividends-${month}-${year}`)} file={watch(`file_dividends-${month}-${year}`)} text={'ver documento'} />
            </div>
            <div style={{ width: '100%' }}>
                <FormFilePicker control={control} name={`file_decore-${month}-${year}`} label={'Declaração comprobatória de percepção de rendimentos (Decore)'} accept={"application/pdf"} />
                <FilePreview url={watch(`url_decore-${month}-${year}`)} file={watch(`file_decore-${month}-${year}`)} text={'ver documento'} />
            </div>
        </div>

    )
})
export default MultiIncomeFile