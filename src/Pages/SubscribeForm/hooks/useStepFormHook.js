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
    const [parsedData, setParsedData] = useState(null)
    useEffect(() => {
        setStepsRefs(Array.from({ length: MAX_STEPS }).fill(createRef()))
    }, [MAX_STEPS])

    const next = async () => {
        const values = getCurrentRef().values()
        const parsedValues = await getCurrentRef().beforeSubmit?.()
        if (isFormValid()) {
            setParsedData((prev) => ({ ...prev, ...parsedValues }))
            setData((prevData) => ({ ...prevData, ...values }))
            switch (activeStep) {
                case MAX_STEPS:
                    // pass data and overwrite properties with parsedData (in case data contains needed fields)
                    // second argument is the unparsed data
                    await onSave({ ...data, ...parsedData, ...parsedValues }, { ...data, ...values })
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
        const parsedValues = await getCurrentRef().beforeSubmit?.()
        if (!isFormValid()) return
        const dataToUpdate = { ...data, ...getCurrentRef().values() }
        setData((prevData) => ({ ...prevData, ...getCurrentRef().values() }))
        await onEdit(dataToUpdate, parsedValues)
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