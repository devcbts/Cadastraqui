import { forwardRef } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import modelDInformationSchema from "./schemas/information-model-d-schame";
const InformationModelD = forwardRef(({ data }, ref) => {
    const { control } = useControlForm({
        schema: modelDInformationSchema,
        defaultValues: {
            admissionDate: "",
        },
        initialData: data
    }, ref)

    return (
        <div className={commonStyles.formcontainer}>
            <InputForm name={"admissionDate"} control={control} label={"date de início do recebimento"} type="date" />
        </div>
    )
})

export default InformationModelD