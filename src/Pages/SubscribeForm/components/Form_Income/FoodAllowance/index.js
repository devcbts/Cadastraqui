import MoneyFormInput from "Components/MoneyFormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import FormCheckbox from "Components/FormCheckbox";
import foodAllowanceSchema from "./schemas/food-allowance-schema";
import useControlForm from "hooks/useControlForm";


const FoodAllowance = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: foodAllowanceSchema,
        defaultValues: {
            hasFoodAllowance: null,
            foodAllowanceValue: '',
        },
        initialData: data
    }, ref)

    const watchFoodAllowance = watch("hasFoodAllowance")

    useEffect(() => {
        if (!watchFoodAllowance) {
            resetField("foodAllowanceValue", { defaultValue: '' })
        }
    }, [watchFoodAllowance])
    return (
        <>
            <FormCheckbox control={control} name={"hasFoodAllowance"} label={"você recebeu auxílio alimentação?"} />
            {
                watchFoodAllowance &&
                <MoneyFormInput control={control} name="foodAllowanceValue" label={"valor recebido"} />
            }
        </>
    )
})

export default FoodAllowance