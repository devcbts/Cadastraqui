import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import { forwardRef, useEffect, useRef } from "react"
import interviewSchema from "./schemas/interview-schema"
import FormSelect from "Components/FormSelect"
import { useWatch } from "react-hook-form"

const Interview = forwardRef(({ data, onChange, schema }, ref) => {
    const isMounted = useRef(false)
    const { control, getValues } = useControlForm({
        schema: schema ?? interviewSchema,
        defaultValues: {
            startDate: "",
            endDate: "",
            duration: 20,
            beginHour: "",
            endHour: "",
            interval: 5
        },
        initialData: data
    }, ref)
    const watch = useWatch({
        control
    })
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }
        const values = getValues()
        if (onChange) {
            onChange(values)
        }
    }, [watch])
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
            <InputForm control={control} name={"startDate"} label={'data de início'} type="date" />
            <InputForm control={control} name={"endDate"} label={'data de término'} type="date" />
            <FormSelect control={control} name={"duration"} label={'duração'} options={[20, 30, 45, 60].map(e => ({ value: e, label: e }))} value={watch.duration} />
            <InputForm control={control} name={"beginHour"} label={'horário de início'} type="time" />
            <InputForm control={control} name={"endHour"} label={'horário de término'} type="time" />
            <FormSelect control={control} name={"interval"} label={'intervalo'} options={[0, 5, 10].map(e => ({ value: e, label: e }))} value={watch.interval}
            />
        </div>
    )
})

export default Interview