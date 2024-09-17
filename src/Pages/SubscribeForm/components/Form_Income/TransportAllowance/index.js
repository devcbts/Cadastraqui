import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import transportAllowanceSchema from "./schemas/transport-allowance-schema";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const TransportAllowance = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: transportAllowanceSchema,
        defaultValues: {
            hastransportAllowanceValue: null,
            transportAllowanceValue: '',
        },
        initialData: data
    }, ref)

    const watchTransportAllowance = watch("hastransportAllowanceValue")

    useEffect(() => {
        if (!watchTransportAllowance) {
            resetField("transportAllowanceValue", { defaultValue: '' })
        }
    }, [watchTransportAllowance])
    useTutorial(INCOME_TUTORIALS.TRANSPORT[data?.incomeSource])
    return (
        <>
            <FormCheckbox control={control} name={"hastransportAllowanceValue"} label={"você recebeu auxílio transporte?"} />
            {
                watchTransportAllowance &&
                <MoneyFormInput control={control} name="transportAllowanceValue" label={"valor recebido"} />
            }
        </>
    )
})

export default TransportAllowance