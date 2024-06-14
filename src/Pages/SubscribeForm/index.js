import { useEffect, useState } from "react";
import FormBasicInformation from "./components/Form_BasicInformation";
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
import FormHealth from "./components/Form_Health";
import FormIncome from "./components/Form_Income";
import { useSetRecoilState } from "recoil";
import headerAtom from "Components/Header/atoms/header-atom";
import FormDeclarations from "./components/Form_Declarations";
import FormExpenses from "./components/Form_Expenses";
export default function SubscribeForm() {
    const [activeStep, setActiveStep] = useState(1)

    const handleChangeCategory = (index) => {
        setActiveStep(index)
    }
    const steps = [
        { label: "Cadastrante", icon: User, component: FormBasicInformation },
        { label: "Grupo Familiar", icon: Family, component: FormFamilyGroup },
        { label: "Moradia", icon: House, component: FormHabitation },
        { label: "Veículo", icon: Car, component: FormVehicle },
        { label: "Renda", icon: Currency, component: FormIncome },
        { label: "Gastos", icon: Money, component: FormExpenses },
        { label: "Saúde", icon: Doctor, component: FormHealth },
        { label: "Declarações", icon: List, component: FormDeclarations },
        // { label: "_", icon: Edit },
    ]
    const setHeader = useSetRecoilState(headerAtom)
    useEffect(() => {
        setHeader({ sidebar: false })
        return () => {
            setHeader({ sidebar: true })
        }
    }, [])
    return (
        <FormStepper.Root vertical activeStep={activeStep}>
            <FormStepper.Stepper>
                {steps.map((e, i) => {
                    const Icon = e.icon
                    return (
                        <FormStepper.Step key={i} index={i + 1} label={e.label} onClick={() => handleChangeCategory(i + 1)}>
                            <Icon />
                        </FormStepper.Step>
                    )
                })}
            </FormStepper.Stepper>
            {
                steps.map((e, i) => {
                    const Component = e.component
                    return (
                        <FormStepper.View key={e.label} index={i + 1}>
                            <Component />
                        </FormStepper.View>
                    )
                })
            }

        </FormStepper.Root>
    )
}