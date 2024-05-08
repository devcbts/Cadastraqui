import { forwardRef, useEffect, useImperativeHandle } from "react";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useForm } from "react-hook-form";
import maritalStatusSchema from "./schemas/marital-status-schema";
import MARITAL_STATUS from "utils/enums/marital-status";
import FormSelect from "Components/FormSelect";
import FormFilePicker from "Components/FormFilePicker";
const MaritalStatus = forwardRef(({ data }, ref) => {
    const { control, formState: { isValid }, trigger, watch, getValues, resetField } = useForm({
        mode: "all",
        defaultValues: {
            maritalStatus: '',
            weddingCertificate: null
        },
        values: data && {
            maritalStatus: data.maritalStatus,
            weddingCertificate: data.weddingCertificate
        },
        resolver: zodResolver(maritalStatusSchema)
    })
    const watchStatus = watch("maritalStatus")
    useEffect(() => {
        if (watchStatus !== "Married") {
            resetField("weddingCertificate", { defaultValue: null })
        }
    }, [watchStatus])
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Estado Civil</h1>
            <div>
                <FormSelect name="maritalStatus" label="Estado civil" control={control} options={MARITAL_STATUS} value={watchStatus} />
                {
                    watchStatus === "Married" &&
                    <FormFilePicker name="weddingCertificate" label="Certidão" control={control} />
                }
            </div>
        </div>
    )
})

export default MaritalStatus