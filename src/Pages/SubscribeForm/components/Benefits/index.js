import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from '../Form_BasicInformation/styles.module.scss'
import benefitsSchema from "./schemas/benefits-schema";

const Benefits = forwardRef(({ data }, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid }, getValues } = useForm({
        mode: "all",
        defaultValues: {
            enrolledGovernmentProgram: false,
            NIS: "",
            attendedPublicHighSchool: "",
            benefitedFromCebasScholarship_basic: "",
            benefitedFromCebasScholarship_professional: ""
        },
        values: data && {
            enrolledGovernmentProgram: data.enrolledGovernmentProgram,
            NIS: data.NIS,
            attendedPublicHighSchool: data.attendedPublicHighSchool,
            benefitedFromCebasScholarship_basic: data.benefitedFromCebasScholarship_basic,
            benefitedFromCebasScholarship_professional: data.benefitedFromCebasScholarship_professional
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

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Benefícios e Programas</h1>
            <div >
                <div>
                    <InputForm name={"enrolledGovernmentProgram"} control={control} label={"inscrito em programa governamental?"} />
                    {watchEnrolledGovProgram &&
                        <InputForm name={"NIS"} control={control} label={"NIS"} />
                    }
                </div>
                <InputForm name={"attendedPublicHighSchool"} control={control} label={"estudou em escola pública?"} />
                <InputForm name={"benefitedFromCebasScholarship_basic"} control={control} label={"já recebeu bolsa CEBAS para educação básica?"} />
                <InputForm name={"benefitedFromCebasScholarship_professional"} control={control} label={"já recebeu bolsa CEBAS para educação profissional?"} />
            </div>
        </div>
    )
})

export default Benefits