import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import reversalValueSchema from "./schemas/reversal-value-schema";
import useControlForm from "hooks/useControlForm";


const ReversalValue = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: reversalValueSchema,
        defaultValues: {
            hasReversal: null,
            reversalValue: '',
        },
        initialData: data
    }, ref)

    const watchReversal = watch("hasReversal")

    useEffect(() => {
        if (!watchReversal) {
            resetField("reversalValue", { defaultValue: '' })
        }
    }, [watchReversal])
    return (
        <>
            <FormCheckbox control={control} name={"hasReversal"} label={"você recebeu indenizações?"} />
            {
                watchReversal &&
                <MoneyFormInput control={control} name="reversalValue" label={"valor recebido"} />
            }
        </>
    )
})

export default ReversalValue