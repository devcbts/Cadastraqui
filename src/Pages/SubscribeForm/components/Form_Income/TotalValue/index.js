import { forwardRef, useImperativeHandle, } from "react";
import InputBase from "Components/InputBase";
import { formatCurrency } from "utils/format-currency";
import stringToFloat from "utils/string-to-float";


const TotalValue = forwardRef(({ data }, ref) => {
    const getTotalValue = () => {
        const dataValues = [
            "grossAmount", "incomeTax", "publicPension", "otherDeductions",
            "foodAllowanceValue", "transportAllowanceValue", "expenseReimbursementValue",
            "advancePaymentValue", "reversalValue", "compensationValue", "judicialPensionValue", "proLabore", "dividends", "parcelValue", "deductionValue",
            "parcels", "parcelValue"]
        let sum = stringToFloat(data.grossAmount) ?
            stringToFloat(data.grossAmount) :
            (stringToFloat(data.dividends) + stringToFloat(data.proLabore))
        const condition = (item) => stringToFloat(data.grossAmount) ? item !== "grossAmount" : (item !== "proLabore" && item !== "dividends")
        dataValues.forEach(e => {
            if (data.hasOwnProperty(e) && condition(e)) {
                sum -= stringToFloat(data[e])
            }

        })
        return Number(sum).toLocaleString("pt-br", { style: "currency", currency: "BRL" })
    }
    const getGrossValue = () => {
        if (stringToFloat(data.grossAmount)) return Number(stringToFloat(data.grossAmount)).toLocaleString("pt-br", { style: "currency", currency: "BRL" })
        if (stringToFloat(data.dividends) && stringToFloat(data.proLabore)) return Number(stringToFloat(data.dividends) + stringToFloat(data.proLabore)).toLocaleString("pt-br", { style: "currency", currency: "BRL" })
        return 0
    }
    useImperativeHandle(ref, () => ({
        validate: () => {
            return true
        },
        values: () => { }
    }))

    return (
        <>
            <InputBase value={getGrossValue()} label="total de rendimentos/renda bruta no mês" disabled error={null} />
            <InputBase value={getTotalValue()} label="renda obtida para fins do processo seletivo" disabled error={null} />
        </>
    )
})

export default TotalValue