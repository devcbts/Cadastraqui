import { forwardRef, useImperativeHandle } from "react"
import useMonthIncome from "../../hooks/useMonthIncome"
import Input from "../../../../Inputs/FormInput"
import RequiredFieldValidation from "../../../../../validation/validators/required-field-validator"
import { formatCurrency } from "../../../../../utils/format-currency"

const MonthsIncomeModelB = forwardRef(({ monthCount, initialData }, ref) => {
    const {
        form: { control, formState: { errors, isValid }, getValues, register, resetField },
        handleCurrency,
        formattedMonths,
        getAverageIncome,
        fieldErrors
    } = useMonthIncome({ inputObj: { month: '', year: '', grossAmount: 0, proLabore: 0, dividents: 0 }, monthCount, initialData })
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
                        label="Valor Bruto"
                        name={`incomeInfo.${i}.grossAmount`}
                        {...register(`incomeInfo.${i}.grossAmount`, {
                            validate: new RequiredFieldValidation(`incomeInfo.${i}.grossAmount`).validate,
                            onChange: handleCurrency,
                        })}
                        error={fieldErrors?.[i]}
                    />
                </>
            ))}
            <label>Renda média obtida para fins deste processo seletivo {formatCurrency(getAverageIncome())}</label>
        </>
    )
})

export default MonthsIncomeModelB