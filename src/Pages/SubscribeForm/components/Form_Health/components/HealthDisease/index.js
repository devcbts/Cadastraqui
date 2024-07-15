import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "Components/FormSelect";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import DISEASES from "utils/enums/diseases";
import FormCheckbox from "Components/FormCheckbox";
import healthDiseaseSchema from "./schemas/health-disease-schema";
import useControlForm from "hooks/useControlForm";
import FormFilePicker from "Components/FormFilePicker";
const HealthDisease = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: healthDiseaseSchema,
        defaultValues: {
            hasDisease: null,
            disease: '',
            specificDisease: '',
            hasMedicalReport: null,
            file_disease: null
        },
        initialData: data
    }, ref)
    const watchDisease = watch("disease")
    const watchHasDisease = watch("hasDisease")

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Doença</h1>
            <FormCheckbox control={control} name={"hasDisease"} label={"possui alguma doença?"} />
            {watchHasDisease &&
                <>
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
                    {
                        watch("hasMedicalReport") && (
                            <FormFilePicker label={'Anexar laudo'} accept={'application/pdf'} control={control} name={'file_disease'} />
                        )
                    }
                </>}

        </div>

    )
})

export default HealthDisease