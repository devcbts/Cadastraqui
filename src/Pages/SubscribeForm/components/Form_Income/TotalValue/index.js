import { forwardRef, useImperativeHandle, } from "react";
import InputBase from "Components/InputBase";


const TotalValue = forwardRef(({ data }, ref) => {

    useImperativeHandle(ref, () => ({
        validate: () => {
            return true
        },
        values: () => { }
    }))

    return (
        <>
            <InputBase value={data.grossAmount} label="total de rendimentos/renda bruta no mês" disabled error={null} />
            <InputBase value={data.grossAmount} label="renda obtida para fins do processo seletivo" disabled error={null} />
        </>
    )
})

export default TotalValue