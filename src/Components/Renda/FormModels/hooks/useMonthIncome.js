import { useFieldArray, useForm } from "react-hook-form"
import monthsArr from "../utils/months-array"
import { formatCurrency } from "../../../../utils/format-currency"
import { toFloat } from "../../../../utils/currency-to-float"
import { useEffect } from "react"


export default function useMonthIncome({ inputObj, checksObj, monthCount, initialData }) {
    let initialDates = !!initialData && initialData?.length !== 0 ? initialData?.sort((a, b) => {
        const dateA = new Date(a.date), dateB = new Date(b.date)
        return dateA < dateB
    }).map(e => e.date) : undefined
    const formattedMonths = monthsArr({ length: monthCount, initialDates })

    const { register, formState: { errors, isValid }, control, resetField, setValue, getValues, watch, reset } = useForm({
        mode: "onChange",
        values: {
            incomeInfo: Array.from({ length: monthCount }).fill(inputObj).map((e, i) => {
                return ({
                    ...e,
                    date: formattedMonths[i].date

                })
            }),

        }
    })

    const watchIncome = watch("incomeInfo")
    const { fields } = useFieldArray({ name: "incomeInfo", control })
    const { register: registerCheckbox, control: controlCheckbox, watch: watchCheck, reset: resetChecks } = useForm({
        values: { checks: Array.from({ length: monthCount }).fill(checksObj) },
        mode: "onChange"
    })
    useFieldArray({ name: "checks", control: controlCheckbox })
    const fieldErrors = errors.incomeInfo?.map((e, i) => ({ ...Object.keys(e).reduce((acc, inner) => ({ ...acc, [`incomeInfo.${i}.${inner}`]: e[inner].message }), {}) }))
    const watchCheckValues = watchCheck("checks")
    const handleCurrency = (e) => {
        let { name, value } = e.target
        setValue(name, formatCurrency(value))
    }
    useEffect(() => {
        if (!!initialData && initialData.length !== 0) {

            const appendOn = monthCount - initialData.length
            const emptyArray = Array.from({ length: monthCount }).fill(inputObj).map((e, i) => {
                if (i >= appendOn) { return initialData[i - appendOn] }
                return { ...e, date: formattedMonths[i].date }
            })

            reset({
                incomeInfo:
                    emptyArray
            })
            resetChecks({
                checks: initialData.map(e => ({ ...Object.keys(e).reduce((acc, key) => ({ ...acc, [key]: isNaN(parseFloat(e[key])) ? e[key] : !!parseFloat(e[key]) }), {}) }))
            })
        }
    }, [])
    const getMonthTotalIncome = (index) => {
        const { grossAmount, foodAllowanceValue,
            transportAllowanceValue,
            expenseReimbursementValue,
            advancePaymentValue,
            reversalValue,
            compensationValue,
            judicialPensionValue, proLabore, dividends } = watchIncome[index]
        if (proLabore && dividends) {
            return Intl.NumberFormat("pt-br", { style: "currency", currency: "brl" }).format((toFloat(proLabore) + toFloat(dividends)).toFixed(2))
        }
        return Intl.NumberFormat("pt-br", { style: "currency", currency: "brl" }).format((toFloat(grossAmount) -
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
            sum += toFloat(getMonthTotalIncome(i))

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