import { forwardRef, useImperativeHandle } from "react";
import InputForm from "../../../../../Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from '../styles.module.scss'
import { useForm } from "react-hook-form";
import maritalStatusSchema from "./schemas/marital-status-schema";
import MARITAL_STATUS from "../../../../../utils/enums/marital-status";
import FormSelect from "../../../../../Components/FormSelect";
const MaritalStatus = forwardRef((_, ref) => {
    const { control, formState: { isValid }, trigger, watch } = useForm({
        mode: "all",
        defaultValues: {
            maritalStatus: '',
            weddingCertificate: ''
        },
        resolver: zodResolver(maritalStatusSchema)
    })
    const watchStatus = watch("maritalStatus")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        }
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Estado Civil</h1>
            <div>
                <FormSelect name="maritalStatus" label="Estado civil" control={control} options={MARITAL_STATUS} value={MARITAL_STATUS.find(e => e.value === watchStatus)} />
                {
                    watchStatus === "Married" &&
                    <InputForm name="weddingCertificate" label="Certidão" control={control} type="file" />
                }
            </div>
        </div>
    )
})

export default MaritalStatus