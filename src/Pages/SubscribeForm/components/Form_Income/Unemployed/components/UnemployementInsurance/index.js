import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import FormCheckbox from "Components/FormCheckbox";
import InputForm from "Components/InputForm";
import MoneyFormInput from "Components/MoneyFormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import unemployementInsuranceSchema from "./schemas/unemployement-insurance-schema";
import ButtonBase from "Components/ButtonBase";
import useControlForm from "hooks/useControlForm";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";
const UnemployementInsurance = forwardRef(({ data, viewMode }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: unemployementInsuranceSchema,
        defaultValues: {
            receivesUnemployment: null,
            parcels: null,
            firstParcelDate: null,
            parcelValue: null
        },
        initialData: data
    }, ref)

    const watchInsurance = watch("receivesUnemployment")

    useEffect(() => {
        if (!watchInsurance) {
            resetField("parcels", { defaultValue: null })
            resetField("firstParcelDate", { defaultValue: null })
            resetField("parcelValue", { defaultValue: null })
        }
    }, [watchInsurance])
    useTutorial(INCOME_TUTORIALS.INFORMATION[data?.incomeSource])
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Seguro Desemprego</h1>
            <fieldset disabled={viewMode}>

                <FormCheckbox name={"receivesUnemployment"} control={control} label={"recebe seguro desemprego?"} />
                {
                    watchInsurance && (
                        <>
                            <MoneyFormInput name="parcelValue" control={control} label={"valor da parcela"} />
                            <InputForm name="firstParcelDate" control={control} type="date" label={"data da primeira parcela"} />
                            <InputForm name="parcels" control={control} label={"quantidade de parcelas"} transform={(e) => {
                                if (!isNaN(parseInt(e.target.value))) {
                                    return parseInt(e.target.value)
                                }
                                return 0
                            }} />
                        </>
                    )

                }
            </fieldset>
        </div>
    )
})

export default UnemployementInsurance