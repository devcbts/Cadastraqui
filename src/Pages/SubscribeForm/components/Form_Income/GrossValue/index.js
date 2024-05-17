import MoneyFormInput from "Components/MoneyFormInput";
import grossValueSchema from "./schemas/gross-value-schema";
import { forwardRef } from "react";
import useControlForm from "hooks/useControlForm";


const GrossValue = forwardRef(({ data }, ref) => {
    const { control } = useControlForm({
        schema: grossValueSchema,
        defaultValues: {
            grossAmount: '',
        },
        initialData: data
    }, ref)

    return (
        <>
            <MoneyFormInput control={control} name="grossAmount" label={"total de rendimentos/renda bruta no mês"} />
        </>
    )
})

export default GrossValue