import { useEffect, useState } from "react";
import BasicInformation from "./components/BasicInformation";
import candidateService from "../../services/candidate/candidateService";
import FormStepper from "../../Components/FormStepper";
import { ReactComponent as User } from '../../Assets/icons/user.svg';
import { ReactComponent as Family } from '../../Assets/icons/family.svg';
import { ReactComponent as House } from '../../Assets/icons/house.svg';
import { ReactComponent as Car } from '../../Assets/icons/car.svg';
import { ReactComponent as Currency } from '../../Assets/icons/currency.svg';
import { ReactComponent as Money } from '../../Assets/icons/money.svg';
import { ReactComponent as Doctor } from '../../Assets/icons/doctor.svg';
import { ReactComponent as List } from '../../Assets/icons/list.svg';
import { ReactComponent as Edit } from '../../Assets/icons/edit.svg';
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
    const steps = [
        { label: "Cadastrante", component: User },
        { label: "Cadastrante", component: Family },
        { label: "Cadastrante", component: House },
        { label: "Cadastrante", component: Car },
        { label: "Cadastrante", component: Currency },
        { label: "Cadastrante", component: Money },
        { label: "Cadastrante", component: Doctor },
        { label: "Cadastrante", component: List },
        { label: "Cadastrante", component: Edit },
    ]
    return (
        <FormStepper.Root vertical activeStep={activeStep}>
            <FormStepper.Stepper>
                {steps.map((e, i) => {
                    const Component = e.component
                    return (
                        <FormStepper.Step index={i + 1} label="Cadastrante" onClick={() => handleChangeCategory(i + 1)}>
                            <Component />
                        </FormStepper.Step>
                    )
                })}
            </FormStepper.Stepper>
            <FormStepper.View index={1}><BasicInformation /></FormStepper.View>
        </FormStepper.Root>
    )
}