import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import foodAllowanceSchema from "./schemas/food-allowance-schema";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";


const FoodAllowance = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: foodAllowanceSchema,
        defaultValues: {
            hasfoodAllowanceValue: null,
            foodAllowanceValue: '',
        },
        initialData: data
    }, ref)

    const watchFoodAllowance = watch("hasfoodAllowanceValue")

    useEffect(() => {
        if (!watchFoodAllowance) {
            resetField("foodAllowanceValue", { defaultValue: '' })
        }
    }, [watchFoodAllowance])
    useTutorial(INCOME_TUTORIALS.FOOD[data?.incomeSource])

    return (
        <>
            <FormCheckbox control={control} name={"hasfoodAllowanceValue"} label={"você recebeu auxílio alimentação?"} />
            {
                watchFoodAllowance &&
                <MoneyFormInput control={control} name="foodAllowanceValue" label={"valor recebido"} />
            }
        </>
    )
})

export default FoodAllowance