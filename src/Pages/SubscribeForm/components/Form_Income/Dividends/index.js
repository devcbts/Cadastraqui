import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import useControlForm from "hooks/useControlForm";
import InputBase from "Components/InputBase";
import stringToFloat from "utils/string-to-float";
import dividendsSchema from "./schemas/dividends-schema";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const Dividends = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: dividendsSchema,
        defaultValues: {
            proLabore: '',
            dividends: '',
        },
        initialData: data
    }, ref)

    const watchProLabore = watch("proLabore")
    const watchDividends = watch("dividends")
    const getTotal = () => {
        const sum = stringToFloat(watchProLabore) + stringToFloat(watchDividends)
        return Number(sum).toLocaleString('pt-br', { style: "currency", currency: "BRL" })
    }
    useTutorial(INCOME_TUTORIALS.DIVIDENDS[data?.incomeSource])
    return (
        <>
            <MoneyFormInput control={control} name="proLabore" label={"valor do pró-labore"} />
            <MoneyFormInput control={control} name="dividends" label={"valor dos dividendos"} />
            <InputBase label="rendimentos totais" value={getTotal()} error={null} readOnly />
        </>
    )
})

export default Dividends