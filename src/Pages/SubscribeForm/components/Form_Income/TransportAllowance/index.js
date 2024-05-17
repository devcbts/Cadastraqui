import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import transportAllowanceSchema from "./schemas/transport-allowance-schema";
import useControlForm from "hooks/useControlForm";


const TransportAllowance = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: transportAllowanceSchema,
        defaultValues: {
            hasTransportAllowance: null,
            transportAllowanceValue: '',
        },
        initialData: data
    }, ref)

    const watchTransportAllowance = watch("hasTransportAllowance")

    useEffect(() => {
        if (!watchTransportAllowance) {
            resetField("transportAllowanceValue", { defaultValue: '' })
        }
    }, [watchTransportAllowance])
    return (
        <>
            <FormCheckbox control={control} name={"hasTransportAllowance"} label={"você recebeu auxílio transporte?"} />
            {
                watchTransportAllowance &&
                <MoneyFormInput control={control} name="transportAllowanceValue" label={"valor recebido"} />
            }
        </>
    )
})

export default TransportAllowance