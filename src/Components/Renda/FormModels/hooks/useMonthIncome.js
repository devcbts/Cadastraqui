import { useFieldArray, useForm } from "react-hook-form"
import monthsArr from "../utils/months-array"
import { formatCurrency } from "../../../../utils/format-currency"
import { toFloat } from "../../../../utils/currency-to-float"

export default function useMonthIncome({ inputObj, checksObj, monthCount }) {

    const formattedMonths = monthsArr({ length: monthCount })
    const { register, formState: { errors, isValid }, control, resetField, setValue, getValues, watch } = useForm({
        mode: "onChange",
        values: {
            incomeInfo: Array.from({ length: monthCount }).fill(inputObj).map((e, i) => ({
                ...e,
                month: formattedMonths[i].month,
                year: formattedMonths[i].year
            })),

        }
    })
    const watchIncome = watch("incomeInfo")
    const { fields } = useFieldArray({ name: "incomeInfo", control })
    const { register: registerCheckbox, control: controlCheckbox, watch: watchCheck, } = useForm({
        values: { checks: Array.from({ length: monthCount }).fill(checksObj) },
        mode: "onChange"
    })
    useFieldArray({ name: "checks", control: controlCheckbox })
    const fieldErrors = errors.incomeInfo?.map((e, i) => ({ ...Object.keys(e).reduce((acc, inner) => ({ ...acc, [`incomeInfo.${i}.${inner}`]: e[inner].message }), {}) }))
    const watchCheckValues = watchCheck("checks")
    const handleCurrency = (e) => {
        setValue(e.target.name, formatCurrency(e.target.value))
    }
    const getMonthTotalIncome = (index) => {
        const { grossAmount, foodAllowanceValue,
            transportAllowanceValue,
            expenseReimbursementValue,
            advancePaymentValue,
            reversalValue,
            compensationValue,
            judicialPensionValue, proLabore, dividends } = watchIncome[index]
        if (proLabore && dividends) {
            return Number((toFloat(proLabore) + toFloat(dividends)).toFixed(2))
        }
        return Number((toFloat(grossAmount) -
            (
                toFloat(foodAllowanceValue) +
                toFloat(transportAllowanceValue) +
                toFloat(expenseReimbursementValue) +
                toFloat(advancePaymentValue) +
                toFloat(reversalValue) +
                toFloat(compensationValue) +
                toFloat(judicialPensionValue)
            )).toFixed(2))
    }
    const getAverageIncome = () => {
        let sum = 0;
        for (let i = 0; i < monthCount; i++) {
            sum += Number(getMonthTotalIncome(i).toFixed(2))
            console.log(Number(sum.toFixed(2)))
        }
        return (sum / monthCount).toFixed(2);
    }

    return {
        form: { register, formState: { errors, isValid }, control, resetField, setValue, getValues },
        formattedMonths,
        fields,
        checks: { registerCheckbox, controlCheckbox, watchCheck, },
        fieldErrors,
        watchCheckValues,
        handleCurrency,
        getAverageIncome,
        getMonthTotalIncome
    }
}