import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import modelAInformationSchema from "./schemas/model-a-information-schema";
import INCOME_SOURCE from "utils/enums/income-source";
import useControlForm from "hooks/useControlForm";
const InformationModelA = forwardRef(({ data }, ref) => {
    const { control } = useControlForm({
        schema: modelAInformationSchema,
        defaultValues: {
            startDate: '',
            position: ''
        },
        initialData: data,
    }, ref)


    return (
        <div className={commonStyles.formcontainer}>
            <InputForm name={"startDate"} control={control} label={"date de início/admissão"} type="date" />
            <InputForm name={"position"} control={control} label={"atividade exercida"} />

        </div>
    )
})

export default InformationModelA