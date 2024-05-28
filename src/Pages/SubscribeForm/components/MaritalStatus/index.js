import { forwardRef, useEffect, useImperativeHandle } from "react";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useForm } from "react-hook-form";
import maritalStatusSchema from "./schemas/marital-status-schema";
import MARITAL_STATUS from "utils/enums/marital-status";
import FormSelect from "Components/FormSelect";
import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import FilePreview from "Components/FilePreview";
const MaritalStatus = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: maritalStatusSchema,
        defaultValues: {
            maritalStatus: '',
            file_weddingCertificate: null,
            url_weddingCertificate: null,
            weddingCertificate_url: null,
        },
        initialData: data
    }, ref)
    console.log(data)
    const watchStatus = watch("maritalStatus")
    const watchFile = watch("file_weddingCertificate")
    useEffect(() => {
        if (watchStatus !== "Married") {
            resetField("weddingCertificate", { defaultValue: null })
        }
    }, [watchStatus])

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Estado Civil</h1>
            <div>
                <FormSelect name="maritalStatus" label="estado civil" control={control} options={MARITAL_STATUS} value={watchStatus} />
                {
                    watchStatus === "Married" &&
                    <>
                        <FormFilePicker name="file_weddingCertificate" label="certidão de casamento" control={control} accept={'application/pdf'} />
                        <FilePreview file={watchFile} url={data.url_weddingCertificate} text={'visualizar certidão'} />
                    </>
                }

            </div>
        </div>
    )
})

export default MaritalStatus