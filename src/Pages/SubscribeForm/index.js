import { useEffect, useState } from "react";
import FormBasicInformation from "./components/Form_BasicInformation";
import candidateService from "services/candidate/candidateService";
import FormStepper from "Components/FormStepper";
import { ReactComponent as User } from 'Assets/icons/user.svg';
import { ReactComponent as Family } from 'Assets/icons/family.svg';
import { ReactComponent as House } from 'Assets/icons/house.svg';
import { ReactComponent as Car } from 'Assets/icons/car.svg';
import { ReactComponent as Currency } from 'Assets/icons/currency.svg';
import { ReactComponent as Money } from 'Assets/icons/money.svg';
import { ReactComponent as Doctor } from 'Assets/icons/doctor.svg';
import { ReactComponent as List } from 'Assets/icons/list.svg';
import { ReactComponent as Edit } from 'Assets/icons/edit.svg';
import FormFamilyGroup from "./components/Form_FamilyGroup";
import FormHabitation from "./components/Form_Habitation";
import FormVehicle from "./components/Form_Vehicle";
export default function SubscribeForm() {
    const [activeStep, setActiveStep] = useState(1)

    const handleChangeCategory = (index) => {
        setActiveStep(index)
    }
    const steps = [
        { label: "Cadastrante", component: User },
        { label: "Grupo Familiar", component: Family },
        { label: "Moradia", component: House },
        { label: "Veículo", component: Car },
        { label: "Renda", component: Currency },
        { label: "Gastos", component: Money },
        { label: "Saúde", component: Doctor },
        { label: "_", component: List },
        { label: "_", component: Edit },
    ]
    return (
        <FormStepper.Root vertical activeStep={activeStep}>
            <FormStepper.Stepper>
                {steps.map((e, i) => {
                    const Component = e.component
                    return (
                        <FormStepper.Step index={i + 1} label={e.label} onClick={() => handleChangeCategory(i + 1)}>
                            <Component />
                        </FormStepper.Step>
                    )
                })}
            </FormStepper.Stepper>
            <FormStepper.View index={1}><FormBasicInformation /></FormStepper.View>
            <FormStepper.View index={2}><FormFamilyGroup /></FormStepper.View>
            <FormStepper.View index={3}><FormHabitation /></FormStepper.View>
            <FormStepper.View index={4}><FormVehicle /></FormStepper.View>
        </FormStepper.Root>
    )
}