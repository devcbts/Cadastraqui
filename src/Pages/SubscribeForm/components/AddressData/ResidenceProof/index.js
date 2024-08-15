import ButtonBase from "Components/ButtonBase";
import FilePreview from "Components/FilePreview";
import FormCheckbox from "Components/FormCheckbox";
import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import metadataSchema from "utils/file/metadata-schema";

import { z } from "zod";

const { forwardRef, useEffect } = require("react");

const ResidenceProof = forwardRef(({ data }, ref) => {
    const { control, watch, setValue, resetField, getValues } = useControlForm({
        defaultValues: {
            file_residenceProof: null,
            url_residenceProof: null,
            hasResidenceProof: null,
            metadata_residenceProof: {
                type: METADATA_FILE_TYPE.RESIDENCE.RESIDENCE,
                category: METADATA_FILE_CATEGORY.Identity
            }
            // deleteFolder: ''
        },
        schema: z.object({
            file_residenceProof: z.instanceof(File).nullish(),
            url_residenceProof: z.string().nullish(),
            hasResidenceProof: z.boolean().nullish(),
            metadata_residenceProof: metadataSchema
            // deleteFolder: z.string().nullish()
        }).superRefine((v, ctx) => {
            if (v.hasResidenceProof && (!v.file_residenceProof && !v.url_residenceProof)) {
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
    const handleDeleteFile = async () => {
        await NotificationService.confirm({
            title: 'Excluir comprovante?',
            onConfirm: async () => {
                try {
                    await candidateService.deleteFile(`${data?.deleteFolder}/residenceProof.pdf`)
                    resetField("url_residenceProof")
                    resetField("file_residenceProof", { defaultValue: null })
                    NotificationService.success({ text: 'Comprovante excluído' })
                } catch (err) {
                    NotificationService.error({ text: 'Não foi possível excluir o arquivo' })
                }
            }
        })
    }
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Comprovante de endereço</h1>
            {
                !!data?.fullName &&
                <h4 className={commonStyles.subTitle}>{data?.fullName}</h4>
            }
            <FormCheckbox label={'possui comprovante de residência?'} name={'hasResidenceProof'} control={control} />
            {
                watch('hasResidenceProof') && (
                    <>
                        <FormFilePicker control={control} name={'file_residenceProof'} accept={'application/pdf'} label={'Comprovante'} />
                        <FilePreview file={watch("file_residenceProof")} url={watch("url_residenceProof")} text={'Ver comprovante'} />
                        {data?.deleteFolder &&
                            (watch("url_residenceProof") || watch("file_residenceProof"))
                            ? <ButtonBase label={'excluir comprovante'} danger onClick={handleDeleteFile} />
                            : null
                        }
                    </>
                )
            }
        </div>
    )
})

export default ResidenceProof