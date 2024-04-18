import { useFieldArray, useForm } from "react-hook-form";
import Input from "../../../../Inputs/FormInput";
import RequiredFieldValidation from "../../../../../validation/validators/required-field-validator";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "../../../../Inputs/FormCheckbox";
import { formatCurrency } from "../../../../../utils/format-currency";
import CheckboxTextInput from "./CheckboxTextInput";
import { toFloat } from "../../../../../utils/currency-to-float";
import monthsArr from "../../utils/months-array";
import useMonthIncome from "../../hooks/useMonthIncome";

const MonthsIncome = forwardRef(({ monthCount, initialData }, ref) => {


    const objectKeys = {
        date: new Date(),
        grossAmount: 0,
        proLabore: 0,
        dividends: 0,
        deductionValue: 0,
        publicPension: 0,
        incomeTax: 0,
        otherDeductions: 0,
        foodAllowanceValue: 0,
        transportAllowanceValue: 0,
        expenseReimbursementValue: 0,
        advancePaymentValue: 0,
        reversalValue: 0,
        compensationValue: 0,
        judicialPensionValue: 0,
    }
    const checkboxesValues = {
        deduction: false,
        foodAllowanceValue: false,
        transportAllowanceValue: false,
        expenseReimbursementValue: false,
        advancePaymentValue: false,
        reversalValue: false,
        compensationValue: false,
        judicialPensionValue: false,
    }
    const {
        form: { control, formState: { errors, isValid }, getValues, register, resetField, setValue },
        checks: { controlCheckbox, registerCheckbox },
        fieldErrors,
        formattedMonths,
        handleCurrency,
        watchCheckValues,
        getAverageIncome,
        getMonthTotalIncome,
        fields
    } = useMonthIncome({ inputObj: objectKeys, checksObj: checkboxesValues, monthCount, initialData })

    const createConditionalCheckboxes = (i, label, field) => {
        return <CheckboxTextInput
            key={field}
            checkname={`checks.${i}.${field}`}
            inputname={`incomeInfo.${i}.${field}`}
            label={label}
            conditionToShow={!!watchCheckValues[i]?.[field]}
            checkregister={{
                ...registerCheckbox(`checks.${i}.${field}`, {
                    onChange: (e) => {
                        setValue(`incomeInfo.${i}.${field}`, objectKeys[field])
                    },
                })
            }}
            inputregister={{
                ...register(`incomeInfo.${i}.${field}`, {
                    validate: watchCheckValues[i]?.[field] && new RequiredFieldValidation(`incomeInfo.${i}.${field}`).validate,
                    onChange: handleCurrency
                })
            }}
            error={fieldErrors?.[i]}
        />
    }

    useImperativeHandle(ref, () => ({
        isValid: isValid,
        getValues: getValues
    }))
    return (
        <div >
            {Array.from({ length: monthCount }).map((_, i) => (
                <>
                    <h1 >{formattedMonths[i].formatDate}</h1>
                    <div style={{ display: "grid", gridTemplateColumns: '1fr' }} key={fields[i]?.id}>
                        <Input
                            label="Total de rendimentos"
                            name={`incomeInfo.${i}.grossAmount`}
                            {...register(`incomeInfo.${i}.grossAmount`, {
                                validate: new RequiredFieldValidation(`incomeInfo.${i}.grossAmount`).validate,
                                onChange: handleCurrency,
                            })}
                            error={fieldErrors?.[i]}
                        />


                        {/*<!-- Teve deduções ? -->*/}
                        <FormCheckbox
                            label="No valor informado, teve deduções?"
                            name={`checks.${i}.deduction`}
                            {...registerCheckbox(`checks.${i}.deduction`, {
                                onChange: (e) => {
                                    resetField(`incomeInfo.${i}.incomeTax`)
                                    resetField(`incomeInfo.${i}.publicPension`)
                                    resetField(`incomeInfo.${i}.otherDeductions`)
                                }
                            })}
                        />

                        {watchCheckValues[i]?.deduction ? (
                            <>
                                <Input
                                    label="Imposto de Renda"
                                    name={`incomeInfo.${i}.incomeTax`}
                                    {...register(`incomeInfo.${i}.incomeTax`, {
                                        validate: watchCheckValues[i]?.deduction && new RequiredFieldValidation(`incomeInfo.${i}.incomeTax`).validate,
                                        onChange: handleCurrency
                                    })}
                                    error={fieldErrors?.[i]}
                                />

                                <Input
                                    label="Previdência Pública"
                                    name={`incomeInfo.${i}.publicPension`}
                                    {...register(`incomeInfo.${i}.publicPension`, {
                                        validate: watchCheckValues[i]?.deduction && new RequiredFieldValidation(`incomeInfo.${i}.publicPension`).validate,
                                        onChange: handleCurrency
                                    })}
                                    error={fieldErrors?.[i]}
                                />

                                <Input
                                    label="Outras Deduções"
                                    name={`incomeInfo.${i}.otherDeductions`}
                                    {...register(`incomeInfo.${i}.otherDeductions`, {
                                        validate: watchCheckValues[i]?.deduction && new RequiredFieldValidation(`incomeInfo.${i}.otherDeductions`).validate,
                                        onChange: handleCurrency
                                    })}
                                    error={fieldErrors?.[i]}
                                />

                            </>
                        ) : (
                            ''
                        )}
                        <>
                            {Array.from(
                                [
                                    { label: "Auxílio Alimentação?", field: "foodAllowanceValue" },
                                    { label: "Auxílio Transporte?", field: "transportAllowanceValue" },
                                    { label: "Diárias e reembolsos de despesas?", field: "expenseReimbursementValue" },
                                    { label: "Adiantamentos e Antecipações?", field: "advancePaymentValue" },
                                    { label: "Indenizações?", field: "reversalValue" },
                                    { label: "Estornos e compensações?", field: "compensationValue" },
                                    { label: "Pensão judicial?", field: "judicialPensionValue" },
                                ]
                            ).map((e) =>
                                createConditionalCheckboxes(i, e.label, e.field))
                            }
                        </>
                        <label>Renda obtida após deduções legais para fins deste processo seletivo R$ {formatCurrency(getMonthTotalIncome(i))}</label>
                    </div>
                </>
            ))}
            <label>Renda média obtida após deduções legais para fins deste processo seletivo R$ {formatCurrency(getAverageIncome())}</label>
        </div>
    )
})
export default MonthsIncome