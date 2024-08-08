import FilePreview from "Components/FilePreview";
import FormCheckbox from "Components/FormCheckbox";
import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'

import { z } from "zod";

const { forwardRef, useEffect } = require("react");

const ResidenceProof = forwardRef(({ data }, ref) => {
    const { control, watch, resetField, getValues } = useControlForm({
        defaultValues: {
            file_residenceProof: null,
            hasResidenceProof: false
        },
        schema: z.object({
            file_residenceProof: z.instanceof(File).nullish(),
            hasResidenceProof: z.boolean().nullish()


        }).superRefine((v, ctx) => {
            if (v.hasResidenceProof && !v.file_residenceProof) {
                ctx.addIssue({
                    message: 'Comprovante de residência obrigatório',
                    path: ['file_residenceProof']
                })
            }
        }),
        initialData: data
    }, ref)
    useEffect(() => {
        if (!watch("hasResidenceProof")) {
            resetField("file_residenceProof", { defaultValue: null })
        }
    }, [watch('hasResidenceProof')])
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Comprovante de endereço</h1>
            <FormCheckbox label={'possui comprovante de residência?'} name={'hasResidenceProof'} control={control} />
            {
                watch('hasResidenceProof') && (
                    <>
                        <FormFilePicker control={control} name={'file_residenceProof'} accept={'application/pdf'} label={'Comprovante'} />
                        <FilePreview file={watch("file_residenceProof")} url={data?.url_residenceProof} text={'Ver comprovante'} />
                    </>
                )
            }
        </div>
    )
})

export default ResidenceProof