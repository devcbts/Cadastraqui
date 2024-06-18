import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import { forwardRef, useEffect } from "react"
import interviewSchema from "./schemas/interview-schema"

const Interview = forwardRef(({ data, onChange }, ref) => {
    const { control, watch, getValues } = useControlForm({
        schema: interviewSchema,
        defaultValues: {
            startDate: "",
            endDate: "",
            duration: "",
            beginHour: "",
            endHour: "",
            interval: ""
        },
        initialData: data
    }, ref)
    useEffect(() => {
        const values = getValues()
        onChange(values)
    }, [watch()])
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
            <InputForm control={control} name={"startDate"} label={'data de início'} type="date" />
            <InputForm control={control} name={"endDate"} label={'data de término'} type="date" />
            <InputForm control={control} name={"duration"} label={'duração'} />
            <InputForm control={control} name={"beginHour"} label={'horário de início'} />
            <InputForm control={control} name={"endHour"} label={'horário de término'} />
            <InputForm control={control} name={"interval"} label={'intervalo'} />
        </div>
    )
})

export default Interview