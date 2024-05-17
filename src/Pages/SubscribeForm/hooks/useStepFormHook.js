import FormStepper from "Components/FormStepper"
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function useStepFormHook({
    render = [],
    onSave,
    onEdit,
    showStepper = true
}) {
    const MAX_STEPS = useMemo(() => render.length, [render])
    const [activeStep, setActiveStep] = useState(1)
    const [stepsRef, setStepsRefs] = useState(Array.from({ length: MAX_STEPS }).fill(createRef()))
    // const { current: stepsRef } = refs
    const getCurrentRef = () => stepsRef[activeStep - 1].current
    const [data, setData] = useState(null)
    const isFormValid = () => getCurrentRef().validate()
    useEffect(() => {
        setStepsRefs(Array.from({ length: MAX_STEPS }).fill(createRef()))
    }, [MAX_STEPS])

    const next = async () => {
        const values = getCurrentRef().values()
        const parsedValues = await getCurrentRef().beforeSubmit()
        console.log(values)
        if (isFormValid()) {
            setData((prevData) => ({ ...prevData, ...values }))
            switch (activeStep) {
                case MAX_STEPS:
                    await onSave({ ...data, ...parsedValues })
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
        const dataToUpdate = { ...data, ...getCurrentRef().values() }
        setData((prevData) => ({ ...prevData, ...getCurrentRef().values() }))
        await onEdit(dataToUpdate)
    }
    const Steps = useCallback(() => {
        return (
            <FormStepper.Root activeStep={activeStep}>
                {showStepper && <FormStepper.Stepper >
                    {Array.from({ length: MAX_STEPS }).map((_, i) => (
                        <FormStepper.Step key={i} index={i + 1}>{i + 1}</FormStepper.Step>
                    ))}
                </FormStepper.Stepper>}
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
    }, [stepsRef, activeStep, data, render, MAX_STEPS])

    return {
        Steps,
        max: MAX_STEPS,
        state: { data, setData, activeStep, setActiveStep },
        pages: { previous, next },
        actions: { handleEdit }
    }

}