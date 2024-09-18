import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import compensationSchema from "./schemas/compensation-schema";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const Compensation = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: compensationSchema,
        defaultValues: {
            hascompensationValue: null,
            compensationValue: '',
        },
        initialData: data
    }, ref)


    const watchCompensation = watch("hascompensationValue")

    useEffect(() => {
        if (!watchCompensation) {
            resetField("compensationValue", { defaultValue: '' })
        }
    }, [watchCompensation])
    useTutorial(INCOME_TUTORIALS.COMPENSATIONS[data?.incomeSource])
    return (
        <>
            <FormCheckbox control={control} name={"hascompensationValue"} label={"você recebeu estornos ou compensações?"} />
            {
                watchCompensation &&
                <MoneyFormInput control={control} name="compensationValue" label={"valor recebido"} />
            }
        </>
    )
})

export default Compensation