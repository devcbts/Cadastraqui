import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import Loader from "Components/Loader";
import FormSelect from "Components/FormSelect";
import candidateService from "services/candidate/candidateService";
import INCOME_SOURCE from "utils/enums/income-source";
import InputForm from "Components/InputForm";
import InputBase from "Components/InputBase";
import { zodResolver } from "@hookform/resolvers/zod";
import incomeSelectionSchema from "./schemas/income-selection-schema";
import useControlForm from "hooks/useControlForm";
const IncomeSelection = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: incomeSelectionSchema,
        defaultValues: {
            member: null,
            incomeSource: '',
        },
        initialData: data
    }, ref)

    const watchIncome = watch("incomeSource")

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Fonte de Renda</h1>
            <InputBase label={"integrante"} value={data.member.fullName} error={null} disabled />
            {
                data.incomeSource ? (
                    <InputBase label="fonte de renda" value={INCOME_SOURCE.find(e => e.value === data.incomeSource).label} error={null} disabled />
                ) :
                    <FormSelect name={"incomeSource"} control={control} label={"fonte de renda"} value={watchIncome} options={INCOME_SOURCE.filter(e => !data.member?.incomeSource?.includes(e.value))} />
            }
        </div>
    )
})

export default IncomeSelection