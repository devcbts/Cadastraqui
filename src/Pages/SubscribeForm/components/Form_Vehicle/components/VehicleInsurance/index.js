import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "Components/InputForm";
import FormCheckbox from "Components/FormCheckbox";
import vehicleInsuranceSchema from "./schemas/vehicle-insurance-schema";
const { forwardRef, useImperativeHandle, useEffect, useState } = require("react");

const VehicleInsurance = forwardRef(({ data }, ref) => {
    const { control, watch, trigger, formState: { isValid }, getValues, resetField } = useForm({
        mode: "all",
        defaultValues: {
            hasInsurance: null,
            insuranceValue: null
        },
        values: data && {
            hasInsurance: data.hasInsurance,
            insuranceValue: data.insuranceValue,
        },
        resolver: zodResolver(vehicleInsuranceSchema)
    })
    const watchInsurance = watch("hasInsurance")

    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues,
    }))

    useEffect(() => {
        if (!watchInsurance) {
            resetField("insuranceValue", { defaultValue: null })
        }
    }, [watchInsurance])


    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Situação do veículo</h1>
            <FormCheckbox name="hasInsurance" label="possui seguro?" control={control} value={watchInsurance} />

            {
                watchInsurance &&
                <InputForm control={control} name="insuranceValue" label="valor do seguro"
                    transform={(e) => {
                        if (!isNaN(parseInt(e.target.value))) {
                            return parseInt(e.target.value, 10)
                        }
                        return 0
                    }} />

            }


        </div>
    )
})

export default VehicleInsurance

