import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from '../Form_BasicInformation/styles.module.scss'
import benefitsSchema from "./schemas/benefits-schema";
import FormCheckbox from "Components/FormCheckbox";
import styles from './styles.module.scss'
const Benefits = forwardRef(({ data }, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid }, getValues, resetField } = useForm({
        mode: "all",
        defaultValues: {
            enrolledGovernmentProgram: false,
            NIS: "",
            attendedPublicHighSchool: false,
            benefitedFromCebasScholarship_basic: false,
            benefitedFromCebasScholarship_professional: false,
            CadUnico: false,
        },
        values: data && {
            enrolledGovernmentProgram: data.enrolledGovernmentProgram,
            NIS: data.NIS,
            attendedPublicHighSchool: data.attendedPublicHighSchool,
            benefitedFromCebasScholarship_basic: data.benefitedFromCebasScholarship_basic,
            benefitedFromCebasScholarship_professional: data.benefitedFromCebasScholarship_professional,
            CadUnico: data.CadUnico
        },
        resolver: zodResolver(benefitsSchema)
    })
    const watchEnrolledGovProgram = watch("enrolledGovernmentProgram")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    useEffect(() => {
        if (!watchEnrolledGovProgram) {
            resetField("NIS", { defaultValue: '', keepDirty: false, keepError: false })
        }
    }, [watchEnrolledGovProgram])
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Benefícios e Programas</h1>
            <div className={styles.container}>
                <div className={watchEnrolledGovProgram && styles.grid}>
                    <FormCheckbox name={"enrolledGovernmentProgram"} control={control} label={"inscrito em programa governamental?"} />
                    {watchEnrolledGovProgram &&
                        <InputForm name={"NIS"} control={control} label={"NIS"} />
                    }
                </div>
                <div className={styles.grid}>
                    <FormCheckbox name={"attendedPublicHighSchool"} control={control} label={"estudou em escola pública?"} />
                    <FormCheckbox name={"benefitedFromCebasScholarship_basic"} control={control} label={"já recebeu bolsa CEBAS para educação básica?"} />
                    <FormCheckbox name={"benefitedFromCebasScholarship_professional"} control={control} label={"já recebeu bolsa CEBAS para educação profissional?"} />
                    <FormCheckbox name={"CadUnico"} control={control} label={"Possui cadastro único?"} />
                </div>
            </div>
        </div>
    )
})

export default Benefits