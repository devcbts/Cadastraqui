import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import FormCheckbox from "Components/FormCheckbox";
import healthMedicationSchema from "./schemas/health-medication-schema";
const HealthMedication = forwardRef(({ data }, ref) => {
    const { control, formState: { isValid }, trigger, getValues, watch } = useForm({
        mode: "all",
        defaultValues: {
            controlledMedication: null,
            medicationName: '',
            obtainedPublicly: null,
            specificMedicationPublicly: ''
        },
        values: data && {
            controlledMedication: data.controlledMedication,
            medicationName: data.medicationName,
            obtainedPublicly: data.obtainedPublicly,
            specificMedicationPublicly: data.specificMedicationPublicly,
        },
        resolver: zodResolver(healthMedicationSchema)
    })
    const watchMedication = watch("controlledMedication")
    const watchObtained = watch("obtainedPublicly")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Medicação</h1>
            <div>
                <FormCheckbox
                    name="controlledMedication"
                    control={control}
                    label={"toma medicamento controlado?"}
                />
                {
                    watchMedication && (
                        <>
                            <InputForm
                                name="medicationName"
                                control={control}
                                label="nome do medicamento"
                            />
                            <FormCheckbox
                                label={"obtém de rede pública?"}
                                control={control}
                                name="obtainedPublicly"
                            />
                            {
                                watchObtained && (
                                    <InputForm
                                        name="specificMedicationPublicly"
                                        control={control}
                                        label="especifique quais"
                                    />
                                )
                            }
                        </>
                    )
                }


            </div>

        </div>

    )
})

export default HealthMedication