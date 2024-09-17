import MoneyFormInput from "Components/MoneyFormInput";
import grossValueSchema from "./schemas/gross-value-schema";
import { forwardRef } from "react";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const GrossValue = forwardRef(({ data }, ref) => {
    const { control } = useControlForm({
        schema: grossValueSchema,
        defaultValues: {
            grossAmount: '',
        },
        initialData: data
    }, ref)
    useTutorial(INCOME_TUTORIALS.GROSS[data?.incomeSource])

    return (
        <>
            <MoneyFormInput control={control} name="grossAmount" label={"total de rendimentos/renda bruta no mês"} />
        </>
    )
})

export default GrossValue