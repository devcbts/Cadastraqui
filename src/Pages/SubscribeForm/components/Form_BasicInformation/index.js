import { createRef, useEffect, useRef, useState } from "react";
import FormStepper from "Components/FormStepper";
import PersonalData from "../PersonalData";
import styles from './styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import AddressData from "../AddressData";
import AdditionalInfo from "../AdditionalInfo";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import MaritalStatus from "../MaritalStatus";
import PersonalInformation from "../PersonalInformation";
import Document from "../Document";
import Benefits from "../Benefits";
import candidateService from "services/candidate/candidateService";
import AdditionalDocuments from "../AdditionalDocuments";
export default function FormBasicInformation() {
    const MAX_STEPS = 8;
    const [activeStep, setActiveStep] = useState(1)
    const [data, setData] = useState(null)
    const [enableEditing, setEnableEditing] = useState(false)
    const { current: stepsRef } = useRef(Array.from({ length: MAX_STEPS }).fill(createRef()))
    const handleEdit = () => {

    }
    const handleNext = () => {
        const { current: currentStep } = stepsRef[activeStep - 1]
        console.log(currentStep.values())
        if (currentStep.validate()) {
            setData((prevData) => ({ ...prevData, ...currentStep.values() }))
            switch (activeStep) {
                case MAX_STEPS:
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
    useEffect(() => {
        const fetchData = async () => {
            const response = await candidateService.getIdentityInfo()
            if (response.data.identityInfo) {
                setEnableEditing(true)
                setData(response.data.identityInfo)
            }
        }
        fetchData()
    }, [])
    return (
        <div className={styles.container}>
            <FormStepper.Root activeStep={activeStep}>
                <FormStepper.Stepper >
                    {Array.from({ length: MAX_STEPS }).map((_, i) => (
                        <FormStepper.Step key={i} index={i + 1}>{i + 1}</FormStepper.Step>
                    ))}
                </FormStepper.Stepper>
                <FormStepper.View index={1}><PersonalData data={data} ref={stepsRef[0]} /></FormStepper.View>
                <FormStepper.View index={2}><AddressData data={data} ref={stepsRef[1]} /></FormStepper.View>
                <FormStepper.View index={3}><AdditionalInfo data={data} ref={stepsRef[2]} /></FormStepper.View>
                <FormStepper.View index={4}><MaritalStatus data={data} ref={stepsRef[3]} /></FormStepper.View>
                <FormStepper.View index={5}><PersonalInformation data={data} ref={stepsRef[4]} /></FormStepper.View>
                <FormStepper.View index={6}><Document data={data} ref={stepsRef[5]} /></FormStepper.View>
                <FormStepper.View index={7}><AdditionalDocuments data={data} ref={stepsRef[6]} /></FormStepper.View>
                <FormStepper.View index={8}><Benefits data={data} ref={stepsRef[7]} /></FormStepper.View>
            </FormStepper.Root>
            <div className={[styles.actions]}>
                {activeStep !== 1 &&
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                {enableEditing &&
                    <ButtonBase onClick={handleEdit} label={"editar"} />
                }
                <ButtonBase onClick={handleNext}>
                    {activeStep === MAX_STEPS ? 'Salvar' : <Arrow width="40px" />}
                </ButtonBase>
            </div>


        </div >
    )
}