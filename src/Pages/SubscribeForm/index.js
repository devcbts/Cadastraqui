import { useEffect } from "react";
import BasicInformation from "./components/BasicInformation";
import candidateService from "../../services/candidate/candidateService";
import FormStepper from "../../Components/FormStepper";

export default function SubscribeForm() {
    useEffect(() => {
        const getInfo = async () => {
            const response = await candidateService.getIdentityInfo()
            console.log(response)
        }
        getInfo()
    }, [])
    return (
        <FormStepper.Root vertical activeStep={1}>
            <FormStepper.Stepper>
                <FormStepper.Step index={1} label="dados pessoais">1</FormStepper.Step>
                <FormStepper.Step index={1}>2</FormStepper.Step>
                <FormStepper.Step index={1}>3</FormStepper.Step>
                <FormStepper.Step index={1}>4</FormStepper.Step>
            </FormStepper.Stepper>
            <FormStepper.View index={1}><BasicInformation /></FormStepper.View>
            <FormStepper.View index={2}>asdasdasd</FormStepper.View>
        </FormStepper.Root>
    )
}