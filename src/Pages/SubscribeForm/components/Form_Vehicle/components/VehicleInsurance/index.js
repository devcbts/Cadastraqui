import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "Components/InputForm";
import FormCheckbox from "Components/FormCheckbox";
import vehicleInsuranceSchema from "./schemas/vehicle-insurance-schema";
import useControlForm from "hooks/useControlForm";
import MoneyFormInput from "Components/MoneyFormInput";
const { forwardRef, useImperativeHandle, useEffect, useState } = require("react");

const VehicleInsurance = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: vehicleInsuranceSchema,
        defaultValues: {
            hasInsurance: null,
            insuranceValue: null
        },
        initialData: data
    }, ref)

    const watchInsurance = watch("hasInsurance")


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
                <MoneyFormInput control={control} name="insuranceValue" label="valor do seguro"
                />

            }


        </div>
    )
})

export default VehicleInsurance

