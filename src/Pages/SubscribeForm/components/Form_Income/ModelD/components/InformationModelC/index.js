import { forwardRef, useEffect, useState } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import modelDInformationSchema from "./schemas/information-model-d-schame";
import ButtonBase from "Components/ButtonBase";
import PropertyOwner from "Pages/SubscribeForm/components/Form_Habitation/components/PropertyOwner";
import Tooltip from "Components/Tooltip";
const InformationModelD = forwardRef(({ data, viewMode }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: modelDInformationSchema,
        defaultValues: {
            admissionDate: "",
            quantity: 6
        },
        initialData: data
    }, ref)
    const watchDate = watch("admissionDate")
    useEffect(() => {
        if (data.incomeSource === "FinancialHelpFromOthers") {
            let total = 3;
            const getMonthDifference = () => {
                const currDate = new Date()
                const date = new Date(watchDate)
                return currDate.getMonth() - date.getMonth() +
                    (12 * (currDate.getFullYear() - date.getFullYear()))
            }
            if (getMonthDifference() > 3) {
                total = 6
            }
            setValue("quantity", total)
        }
    }, [watchDate])
    const [pdf, setPdf] = useState(false)
    return (
        <div className={commonStyles.formcontainer}>
            <fieldset disabled={viewMode}>
                <InputForm name={"admissionDate"} control={control} label={"date de início do recebimento"} type="date" />
            </fieldset>
        </div>
    )
})

export default InformationModelD