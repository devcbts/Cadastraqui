import { forwardRef, useImperativeHandle } from "react"
import useMonthIncome from "../../hooks/useMonthIncome"
import Input from "../../../../Inputs/FormInput"
import RequiredFieldValidation from "../../../../../validation/validators/required-field-validator"
import { formatCurrency } from "../../../../../utils/format-currency"

const MonthsIncomeModelD = forwardRef(({ monthCount, initialData }, ref) => {
    const {
        form: { control, formState: { errors, isValid }, getValues, register, resetField },
        handleCurrency,
        formattedMonths,
        getMonthTotalIncome,
        fieldErrors
    } = useMonthIncome({ inputObj: { month: '', year: '', proLabore: 0, dividends: 0 }, monthCount, initialData })
    useImperativeHandle(ref, () => ({
        isValid: isValid,
        getValues: getValues
    }))
    return (
        <>
            {Array.from({ length: monthCount }).map((_, i) => (
                <>
                    <h1>{formattedMonths[i].formatDate}</h1>
                    <Input
                        label="Valor do pró-labore"
                        name={`incomeInfo.${i}.proLabore`}
                        {...register(`incomeInfo.${i}.proLabore`, {
                            validate: new RequiredFieldValidation(`incomeInfo.${i}.proLabore`).validate,
                            onChange: handleCurrency,
                        })}
                        error={fieldErrors?.[i]}
                    />
                    <Input
                        label="Valor dos dividendos"
                        name={`incomeInfo.${i}.dividends`}
                        {...register(`incomeInfo.${i}.dividends`, {
                            validate: new RequiredFieldValidation(`incomeInfo.${i}.dividends`).validate,
                            onChange: handleCurrency,
                        })}
                        error={fieldErrors?.[i]}
                    />
                    <label>Total em {formattedMonths[i].formatDate} {formatCurrency(getMonthTotalIncome(i))}</label>
                </>
            ))}
        </>
    )
})

export default MonthsIncomeModelD