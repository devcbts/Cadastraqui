import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import benefitsSchema from "./schemas/benefits-schema";
import FormCheckbox from "Components/FormCheckbox";
import styles from './styles.module.scss'
import useControlForm from "hooks/useControlForm";
const Benefits = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: benefitsSchema,
        defaultValues: {
            enrolledGovernmentProgram: null,
            NIS: "",
            attendedPublicHighSchool: null,
            benefitedFromCebasScholarship_basic: null,
            benefitedFromCebasScholarship_professional: null,
            CadUnico: null,
        },
        initialData: data
    }, ref)


    const watchCad = watch("CadUnico")

    useEffect(() => {
        if (!watchCad) {
            resetField("NIS", { defaultValue: '', keepDirty: false, keepError: false })
        }
    }, [watchCad])
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Benefícios e Programas</h1>
            <div className={styles.container}>
                <div className={watchCad && styles.grid}>
                    <FormCheckbox name={"CadUnico"} control={control} label={"Inscrito no cadastro único?"} />

                    {watchCad &&
                        <InputForm name={"NIS"} control={control} label={"Número de Identificação Social (NIS)"} />
                    }
                </div>
                <div className={styles.grid}>
                    <FormCheckbox name={"attendedPublicHighSchool"} control={control} label={"estudou em escola pública?"} />
                    <FormCheckbox name={"benefitedFromCebasScholarship_basic"} control={control} label={"já recebeu bolsa CEBAS para educação básica?"} />
                    <FormCheckbox name={"benefitedFromCebasScholarship_professional"} control={control} label={"já recebeu bolsa CEBAS para educação profissional?"} />
                    <FormCheckbox name={"enrolledGovernmentProgram"} control={control} label={"inscrito em programa governamental?"} />
                </div>
            </div>
        </div>
    )
})

export default Benefits