import MoneyFormInput from "Components/MoneyFormInput";
import { forwardRef, useEffect } from "react";
import FormCheckbox from "Components/FormCheckbox";
import advancePaymentSchema from "./schemas/advance-payment-schema";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const AdvancePayment = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: advancePaymentSchema,
        defaultValues: {
            hasadvancePaymentValue: null,
            advancePaymentValue: '',
        },
        initialData: data
    }, ref)

    const watchPayment = watch("hasadvancePaymentValue")

    useEffect(() => {
        if (!watchPayment) {
            resetField("advancePaymentValue", { defaultValue: '' })
        }
    }, [watchPayment])
    useTutorial(INCOME_TUTORIALS.ADVANCED_PAYMENT[data?.incomeSource])
    return (
        <>
            <FormCheckbox control={control} name={"hasadvancePaymentValue"} label={"você recebeu adiantamentos ou antecipações?"} />
            {
                watchPayment &&
                <MoneyFormInput control={control} name="advancePaymentValue" label={"valor recebido"} />
            }
        </>
    )
})

export default AdvancePayment