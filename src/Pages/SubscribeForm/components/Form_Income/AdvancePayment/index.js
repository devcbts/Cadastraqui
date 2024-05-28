import MoneyFormInput from "Components/MoneyFormInput";
import { forwardRef, useEffect } from "react";
import FormCheckbox from "Components/FormCheckbox";
import advancePaymentSchema from "./schemas/advance-payment-schema";
import useControlForm from "hooks/useControlForm";


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