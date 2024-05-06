import { createRef, useRef, useState } from "react";
import FormStepper from "../../../../Components/FormStepper";
import PersonalData from "./PersonalData";
import styles from './styles.module.scss';
import ButtonBase from "../../../../Components/ButtonBase";
import AddressData from "./AddressData";
import AdditionalInfo from "./AdditionalInfo";
import { ReactComponent as Arrow } from '../../../../Assets/icons/arrow.svg'
import MaritalStatus from "./MaritalStatus";
import PersonalInformation from "./PersonalInformation";
export default function BasicInformation() {
    const [activeStep, setActiveStep] = useState(1)

    const handleNext = () => {
        if (stepsRef[activeStep - 1].current.validate()) {
            setActiveStep((prevState) => prevState + 1)
        }
        setActiveStep((prevState) => prevState + 1)
    }
    const handlePrevious = () => {
        setActiveStep((prevState) => prevState - 1)
    }
    const { current: stepsRef } = useRef(Array.from({ length: 8 }).fill(createRef()))
    console.log(stepsRef)
    return (
        <div className={styles.container}>
            <FormStepper.Root activeStep={activeStep}>
                <FormStepper.Stepper >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <FormStepper.Step key={i} index={i + 1}>{i + 1}</FormStepper.Step>
                    ))}
                </FormStepper.Stepper>
                <FormStepper.View index={1}><PersonalData ref={stepsRef[0]} /></FormStepper.View>
                <FormStepper.View index={2}><AddressData ref={stepsRef[1]} /></FormStepper.View>
                <FormStepper.View index={3}><AdditionalInfo ref={stepsRef[2]} /></FormStepper.View>
                <FormStepper.View index={4}><MaritalStatus ref={stepsRef[3]} /></FormStepper.View>
                <FormStepper.View index={5}><PersonalInformation ref={stepsRef[4]} /></FormStepper.View>
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