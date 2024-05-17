import MoneyFormInput from "Components/MoneyFormInput";
import { forwardRef, useEffect } from "react";
import FormCheckbox from "Components/FormCheckbox";
import advancePaymentSchema from "./schemas/advance-payment-schema";
import useControlForm from "hooks/useControlForm";


const AdvancePayment = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: advancePaymentSchema,
        defaultValues: {
            hasPayment: null,
            advancePaymentValue: '',
        },
        initialData: data
    }, ref)

    const watchPayment = watch("hasPayment")

    useEffect(() => {
        if (!watchPayment) {
            resetField("advancePaymentValue", { defaultValue: '' })
        }
    }, [watchPayment])
    return (
        <>
            <FormCheckbox control={control} name={"hasPayment"} label={"você recebeu adiantamentos ou antecipações?"} />
            {
                watchPayment &&
                <MoneyFormInput control={control} name="advancePaymentValue" label={"valor recebido"} />
            }
        </>
    )
})

export default AdvancePayment