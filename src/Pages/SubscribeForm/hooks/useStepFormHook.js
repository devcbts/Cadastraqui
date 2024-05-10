import FormStepper from "Components/FormStepper"
import { createRef, useRef, useState } from "react"

export default function useStepFormHook({
    render = [],
    onSave,
    onEdit,
}) {
    const MAX_STEPS = render.length
    const [activeStep, setActiveStep] = useState(1)
    const { current: stepsRef } = useRef(Array.from({ length: MAX_STEPS }).fill(createRef()))
    const getCurrentRef = () => stepsRef[activeStep - 1].current
    const [data, setData] = useState(null)
    const isFormValid = () => getCurrentRef().validate()
    const next = async () => {
        if (isFormValid()) {
            setData((prevData) => ({ ...prevData, ...getCurrentRef().values() }))
            switch (activeStep) {
                case MAX_STEPS:
                    await onSave({ ...data, ...getCurrentRef().values() })
                    break;
                default:
                    setActiveStep((prevState) => prevState + 1)
                    break;
            }
        }
    }
    const previous = () => {
        setActiveStep((prevState) => prevState - 1)
    }

    const handleEdit = async () => {
        if (!isFormValid()) return
        console.log('DADOS', data)
        const dataToUpdate = { ...data, ...getCurrentRef().values() }
        await onEdit(dataToUpdate)
    }
    const Steps = () => {
        return (
            <FormStepper.Root activeStep={activeStep}>
                <FormStepper.Stepper >
                    {Array.from({ length: MAX_STEPS }).map((_, i) => (
                        <FormStepper.Step key={i} index={i + 1}>{i + 1}</FormStepper.Step>
                    ))}
                </FormStepper.Stepper>
                {render.map((e, index) => {
                    const Component = e
                    return (
                        <FormStepper.View index={index + 1}>
                            <Component data={data} ref={stepsRef[index]} />
                        </FormStepper.View>
                    )
                })}
            </FormStepper.Root>
        )
    }

    return {
        Steps,
        max: MAX_STEPS,
        state: { data, setData, activeStep, setActiveStep },
        pages: { previous, next },
        actions: { handleEdit }
    }

}