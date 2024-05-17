import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import FormCheckbox from "Components/FormCheckbox";
import healthMedicationSchema from "./schemas/health-medication-schema";
import useControlForm from "hooks/useControlForm";
const HealthMedication = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: healthMedicationSchema,
        defaultValues: {
            controlledMedication: null,
            medicationName: '',
            obtainedPublicly: null,
            specificMedicationPublicly: ''
        },
        initialData: data
    }, ref)

    const watchMedication = watch("controlledMedication")
    const watchObtained = watch("obtainedPublicly")

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