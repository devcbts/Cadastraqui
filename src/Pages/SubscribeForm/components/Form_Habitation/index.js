import ButtonBase from 'Components/ButtonBase';
import FormStepper from 'Components/FormStepper';
import Loader from 'Components/Loader';
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import { createRef, useRef, useState } from 'react';
import PropertyStatus from './components/PropertyStatus';
import PropertyInfo from './components/PropertyInfo';

export default function FormHabitation() {
    const itemsToRender = [
        PropertyStatus,
        PropertyInfo
    ]
    const MAX_STEPS = itemsToRender.length;
    const [activeStep, setActiveStep] = useState(1)
    const { current: stepsRef } = useRef(Array.from({ length: MAX_STEPS }).fill(createRef()))
    const [isLoading, setIsLoading] = useState(false)
    const getCurrentRef = () => stepsRef[activeStep - 1].current
    const [data, setData] = useState(null)
    const [enableEditing, setEnableEditing] = useState(false)
    const isFormValid = () => getCurrentRef().validate()

    const handleNext = () => {
        if (isFormValid()) {
            setData((prevData) => ({ ...prevData, ...getCurrentRef().values() }))
            switch (activeStep) {
                case MAX_STEPS:
                    handleSave()
                    break;
                default:
                    setActiveStep((prevState) => prevState + 1)
                    break;
            }
        }
    }
    const handlePrevious = () => {
        setActiveStep((prevState) => prevState - 1)
    }
    const handleSave = () => {

    }
    const handleEdit = () => {

    }
    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            <FormStepper.Root activeStep={activeStep}>
                <FormStepper.Stepper >
                    {Array.from({ length: MAX_STEPS }).map((_, i) => (
                        <FormStepper.Step key={i} index={i + 1}>{i + 1}</FormStepper.Step>
                    ))}
                </FormStepper.Stepper>
                {itemsToRender.map((e, index) => {
                    const Component = e
                    return (
                        <FormStepper.View index={index + 1}>
                            <Component data={data} ref={stepsRef[index]} />
                        </FormStepper.View>
                    )
                })}
            </FormStepper.Root>
            <div className={commonStyles.actions}>
                {activeStep !== 1 &&
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                {enableEditing &&
                    <ButtonBase onClick={handleEdit} label={"editar"} />
                }
                {activeStep !== MAX_STEPS &&
                    <ButtonBase onClick={handleNext}>
                        <Arrow width="40px" />
                    </ButtonBase>
                }
                {
                    (activeStep === MAX_STEPS && !enableEditing) && (
                        <ButtonBase onClick={handleNext}>
                            Salvar
                        </ButtonBase>
                    )
                }
            </div>
        </div >
    )
}