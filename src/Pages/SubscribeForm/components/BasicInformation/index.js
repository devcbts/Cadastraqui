import { createRef, useEffect, useRef, useState } from "react";
import FormStepper from "../../../../Components/FormStepper";
import PersonalData from "./PersonalData";
import styles from './styles.module.scss';
import ButtonBase from "../../../../Components/ButtonBase";
import AddressData from "./AddressData";
import AdditionalInfo from "./AdditionalInfo";
import { ReactComponent as Arrow } from '../../../../Assets/icons/arrow.svg'
import MaritalStatus from "./MaritalStatus";
import PersonalInformation from "./PersonalInformation";
import Document from "./Document";
import AdditionalDocuments from "./AdditionalDocuments";
import Benefits from "./Benefits";
import candidateService from "../../../../services/candidate/candidateService";
export default function BasicInformation() {
    const [activeStep, setActiveStep] = useState(1)
    const [data, setData] = useState(null)
    const handleNext = () => {
        const { current: currentStep } = stepsRef[activeStep - 1]
        if (currentStep.validate()) {
            console.log('validou', currentStep.values())
            setData((prevData) => ({ ...prevData, ...currentStep.values() }))
            switch (activeStep) {
                case 8:
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
    const { current: stepsRef } = useRef(Array.from({ length: 8 }).fill(createRef()))
    useEffect(() => {
        const fetchData = async () => {
            const response = await candidateService.getIdentityInfo()
            console.log(response.data)
            setData(response.data.identityInfo)
        }
        fetchData()
    }, [])
    return (
        <div className={styles.container}>
            <FormStepper.Root activeStep={activeStep}>
                <FormStepper.Stepper >
                    {Array.from({ length: 8 }).map((_, i) => (
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
            <div className={styles.actions}>
                {activeStep !== 1 &&
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                <ButtonBase onClick={handleNext}>
                    <Arrow width="40px" />
                </ButtonBase>
            </div>


        </div >
    )
}