import MoneyFormInput from "Components/MoneyFormInput";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import { forwardRef } from "react";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";
import grossValueSchema from "./schemas/gross-value-schema";


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
            {console.log(data.analysisComplete)}
            <MoneyFormInput disabled={data.analysisComplete} control={control} name="grossAmount" label={"total de rendimentos/renda bruta no mês"} />
        </>
    )
})

export default GrossValue