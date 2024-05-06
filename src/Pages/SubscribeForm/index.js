import { useEffect, useState } from "react";
import BasicInformation from "./components/BasicInformation";
import candidateService from "../../services/candidate/candidateService";
import FormStepper from "../../Components/FormStepper";
import { ReactComponent as User } from '../../Assets/icons/user.svg';
import { ReactComponent as Family } from '../../Assets/icons/family.svg';
export default function SubscribeForm() {
    const [activeStep, setActiveStep] = useState(1)
    useEffect(() => {
        const getInfo = async () => {
            const response = await candidateService.getIdentityInfo()
            console.log(response)
        }
        getInfo()
    }, [])
    const handleChangeCategory = (index) => {
        setActiveStep(index)
    }
    return (
        <FormStepper.Root vertical activeStep={activeStep}>
            <FormStepper.Stepper>
                <FormStepper.Step index={1} label="Cadastrante" onClick={() => handleChangeCategory(1)}>
                    <User />
                </FormStepper.Step>
                <FormStepper.Step index={2} label="Grupo familiar" onClick={() => handleChangeCategory(2)}>
                    <Family />
                </FormStepper.Step>
                <FormStepper.Step index={3}>3</FormStepper.Step>
                <FormStepper.Step index={4}>4</FormStepper.Step>
            </FormStepper.Stepper>
            <FormStepper.View index={1}><BasicInformation /></FormStepper.View>
        </FormStepper.Root>
    )
}