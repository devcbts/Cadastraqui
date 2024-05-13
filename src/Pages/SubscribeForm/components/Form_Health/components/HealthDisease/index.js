import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "Components/FormSelect";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import DISEASES from "utils/enums/diseases";
import FormCheckbox from "Components/FormCheckbox";
import healthDiseaseSchema from "./schemas/health-disease-schema";
const HealthDisease = forwardRef(({ data }, ref) => {
    const { control, formState: { isValid }, trigger, getValues, watch } = useForm({
        mode: "all",
        defaultValues: {
            disease: '',
            specificDisease: '',
            hasMedicalReport: '',
        },
        values: data && {
            disease: data.disease,
            specificDisease: data.specificDisease,
            hasMedicalReport: data.hasMedicalReport,
        },
        resolver: zodResolver(healthDiseaseSchema)
    })
    const watchDisease = watch("disease")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Doença</h1>
            <div>
                <FormSelect
                    name="disease"
                    control={control}
                    label={"doença"}
                    options={DISEASES}
                    value={watchDisease}
                />
                {
                    watchDisease === "specificDisease" && (
                        <InputForm
                            name="specificDisease"
                            control={control}
                            label="doença específica"
                        />
                    )
                }
                <FormCheckbox
                    name="hasMedicalReport"
                    control={control}
                    label="possui relatório médico?"
                />

            </div>

        </div>

    )
})

export default HealthDisease