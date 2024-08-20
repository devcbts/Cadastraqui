import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import FormCheckbox from "Components/FormCheckbox";
import healthMedicationSchema from "./schemas/health-medication-schema";
import useControlForm from "hooks/useControlForm";
import FormFilePicker from "Components/FormFilePicker";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
const HealthMedication = forwardRef(({ data }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: healthMedicationSchema,
        defaultValues: {
            controlledMedication: null,
            medicationName: '',
            obtainedPublicly: null,
            specificMedicationPublicly: '',
            file_medication: null,
            // metadata_medication: {
            //     type: METADATA_FILE_TYPE.HEALTH.EXAM,
            //     category: METADATA_FILE_CATEGORY.Medication,
            // }
        },
        initialData: data
    }, ref)
    // useEffect(() => {
    //     setValue("metadata_medication", {
    //         ...watch("metadata_medication"),
    //         medication: watch("medicationName")
    //     })
    // }, [watch("medicationName")])
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
                            <FormFilePicker
                                control={control}
                                name={"file_medication"}
                                label={'Receita do medicamento'}
                            />
                        </>
                    )
                }


            </div>

        </div>

    )
})

export default HealthMedication