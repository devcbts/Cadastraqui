import { useForm } from "react-hook-form";
import FormSelect from "Components/FormSelect";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "Components/InputForm";
import vehicleSituationSchema from "./schemas/vehicle-situation-schema";
import VEHICLE_SITUATION from "utils/enums/vehicle-situation-type";
import styles from './styles.module.scss'
const { forwardRef, useImperativeHandle, useEffect, useState } = require("react");

const VehicleSituation = forwardRef(({ data }, ref) => {
    const { control, watch, trigger, formState: { isValid }, getValues, resetField } = useForm({
        mode: "all",
        defaultValues: {
            situation: '',
            financedMonths: '',
            monthsToPayOff: '',
        },
        values: data && {
            situation: data.situation,
            financedMonths: data.financedMonths,
            monthsToPayOff: data.monthsToPayOff,
        },
        resolver: zodResolver(vehicleSituationSchema)
    })
    const watchVehicleSituation = watch("situation")
    const isFinanced = watchVehicleSituation === "Financed"

    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues,
        needsUpdate: true
    }))

    useEffect(() => {
        if (!isFinanced) {
            resetField("financedMonths", { defaultValue: '' })
            resetField("monthsToPayOff", { defaultValue: '' })
        }
    }, [watchVehicleSituation])


    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Situação do veículo</h1>
            <FormSelect name="situation" label="situação do veículo" control={control} options={VEHICLE_SITUATION} value={watchVehicleSituation} />

            {
                isFinanced &&
                <div className={styles.grid}>
                    <InputForm control={control} name="financedMonths" label="meses financiados"
                        transform={(e) => {
                            if (!isNaN(parseInt(e.target.value))) {
                                return parseInt(e.target.value, 10)
                            }
                            return 0
                        }}

                    />
                    <InputForm control={control} name="monthsToPayOff" label="meses para quitação"
                        transform={(e) => {
                            if (!isNaN(parseInt(e.target.value))) {
                                return parseInt(e.target.value, 10)
                            }
                            return 0
                        }}
                    />
                </div>
            }


        </div>
    )
})

export default VehicleSituation

