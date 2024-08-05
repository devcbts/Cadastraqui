import FormStepper from "Components/FormStepper"
import React, { createRef, useCallback, useEffect, useMemo, useState } from "react"
// viewMode can be false - validation on, or true - disable validation 
export default function useStepFormHook({
    render = [],
    onSave,
    onEdit,
    viewMode = false,
    showStepper = true,
    tooltips = {}
}) {
    const MAX_STEPS = useMemo(() => render.length, [render])
    const [activeStep, setActiveStep] = useState(1)
    const [stepsRef, setStepsRefs] = useState(Array.from({ length: MAX_STEPS }).fill(createRef()))
    // const { current: stepsRef } = refs
    const getCurrentRef = () => stepsRef[activeStep - 1].current
    const [data, setData] = useState(null)
    const isFormValid = () => !viewMode ? getCurrentRef().validate() : true
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
                    setParsedData(null)
                    // setData(null)
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
        console.log('mudei aqui')
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
                        <FormStepper.View index={index + 1} >
                            {
                                // is react.isvalid element (Component is JSX <Element /> can clone)
                                // else Component is ref 'Element' need to create
                                // the diff is the first one can receive props outside of this component
                                React.isValidElement(Component) ?
                                    React.cloneElement(Component, {
                                        key: index,
                                        data: data,
                                        ref: stepsRef[index],
                                        viewMode: viewMode,
                                        tooltips: tooltips?.[index]
                                    })
                                    :
                                    React.createElement(Component, {
                                        key: index,
                                        data: data,
                                        ref: stepsRef[index],
                                        viewMode: viewMode,
                                        tooltips: tooltips?.[index]
                                    })
                            }
                            {/* <Component data={data} ref={stepsRef[index]} viewMode={viewMode} tooltips={tooltips?.[index]} /> */}
                        </FormStepper.View>
                    )
                })}
            </FormStepper.Root>
        )
    }, [activeStep, showStepper, MAX_STEPS, render, data, stepsRef, viewMode])

    return {
        Steps,
        max: MAX_STEPS,
        state: { data, setData, activeStep, setActiveStep },
        pages: { previous, next },
        actions: { handleEdit }
    }

}