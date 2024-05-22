import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import expenseReimbursementSchema from "./schemas/expense-reimbursement-schema";
import useControlForm from "hooks/useControlForm";


const ExpenseReimbursement = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: expenseReimbursementSchema,
        defaultValues: {
            hasexpenseReimbursementValue: null,
            expenseReimbursementValue: '',
        },
        initialData: data
    }, ref)

    const watchExpense = watch("hasexpenseReimbursementValue")

    useEffect(() => {
        if (!watchExpense) {
            resetField("expenseReimbursementValue", { defaultValue: '' })
        }
    }, [watchExpense])
    return (
        <>
            <FormCheckbox control={control} name={"hasexpenseReimbursementValue"} label={"você recebeu diárias e reembolsos de despesas?"} />
            {
                watchExpense &&
                <MoneyFormInput control={control} name="expenseReimbursementValue" label={"valor recebido"} />
            }
        </>
    )
})

export default ExpenseReimbursement