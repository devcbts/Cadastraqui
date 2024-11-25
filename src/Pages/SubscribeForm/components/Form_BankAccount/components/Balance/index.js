import InputForm from "Components/InputForm";
import MoneyFormInput from "Components/MoneyFormInput";
import useControlForm from "hooks/useControlForm";
import balanceSchema from "./balance-schema";

const { forwardRef } = require("react");

const Balance = forwardRef(({ data, }, ref) => {
    const { control } = useControlForm({
        schema: balanceSchema,
        defaultValues: {
            balanceid: null,
            initialBalance: '',
            entryBalance: '',
            outflowBalance: '',
            totalBalance: '',
        },
        initialData: data
    }, ref)
    return (
        <>
            <MoneyFormInput control={control} label={'Saldo inicial'} name={"initialBalance"} />
            <MoneyFormInput control={control} label={'Total de entradas'} name={"entryBalance"} />
            <MoneyFormInput control={control} label={'Total de saídas'} name={"outflowBalance"} />
            <MoneyFormInput control={control} label={'Saldo final do período'} name={"totalBalance"} />
        </>
    )
})

export default Balance