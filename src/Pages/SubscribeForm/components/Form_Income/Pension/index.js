import { zodResolver } from "@hookform/resolvers/zod";
import FormCheckbox from "Components/FormCheckbox";
import MoneyFormInput from "Components/MoneyFormInput";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import pensionSchema from "./schemas/pension-schema";
import styles from './styles.module.scss'
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const Pension = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: pensionSchema,
        defaultValues: {
            hasjudicialPensionValue: null,
            judicialPensionValue: '',
        },
        initialData: data
    }, ref)

    const watchPension = watch("hasjudicialPensionValue")

    useEffect(() => {
        if (!watchPension) {
            resetField("judicialPensionValue", { defaultValue: null })
        }
    }, [watchPension])
    useTutorial(INCOME_TUTORIALS.PENSION[data?.incomeSource])
    return (
        <>
            <p className={styles.text}>
                Você <span>pagou pensão alimentícia</span>, exclusivamente no caso
                de decisão judicial, acordo homologado judicialmente ou
                por meio de escritura pública que assim o determine?
            </p>
            <FormCheckbox control={control} name="hasjudicialPensionValue" />
            {
                watchPension && (
                    <MoneyFormInput control={control} name={"judicialPensionValue"} label={"valor da pensão"} />
                )
            }
        </>
    )
})

export default Pension