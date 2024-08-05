import { useEffect, useMemo, useState } from "react"
import ViewBasicInformation from "./components/View_BasicInformation"
import { useSetRecoilState } from "recoil"
import { ReactComponent as User } from 'Assets/icons/user.svg'
import { ReactComponent as Family } from 'Assets/icons/family.svg'
import { ReactComponent as House } from 'Assets/icons/house.svg'
import { ReactComponent as Car } from 'Assets/icons/car.svg'
import { ReactComponent as Currency } from 'Assets/icons/currency.svg'
import { ReactComponent as Money } from 'Assets/icons/money.svg'
import { ReactComponent as Doctor } from 'Assets/icons/doctor.svg'
import { ReactComponent as List } from 'Assets/icons/list.svg'
import FormStepper from "Components/FormStepper"
import headerAtom from "Components/Header/atoms/header-atom"
import { useLocation, useNavigate } from "react-router"
import ViewFamilyGroup from "./components/View_FamilyGroup"
import ViewHabitation from "./components/View_Habitation"
import ViewVehicle from "./components/View_Vehicle"
import ViewIncome from "./components/View_Income"
import ViewExpenses from "./components/View_Expenses"
import ViewHealth from "./components/View_Health"
import ViewDeclarations from "./components/View_Declarations"
import ButtonBase from "Components/ButtonBase"
export default function CandidateView() {
    const [activeStep, setActiveStep] = useState(1)
    const location = useLocation()
    const { state } = location
    const navigate = useNavigate()
    const handleChangeCategory = (index) => {
        setActiveStep(index)
    }
    // Each component will receive candidateId and applicationId props
    const steps = useMemo(() => [
        { label: "Cadastrante", icon: User, component: ViewBasicInformation },
        { label: "Grupo Familiar", icon: Family, component: ViewFamilyGroup },
        { label: "Moradia", icon: House, component: ViewHabitation },
        { label: "Veículo", icon: Car, component: ViewVehicle },
        { label: "Renda", icon: Currency, component: ViewIncome },
        { label: "Gastos", icon: Money, component: ViewExpenses },
        { label: "Saúde", icon: Doctor, component: ViewHealth },
        { label: "Declarações", icon: List, component: ViewDeclarations },
        // { label: "_", icon: Edit },
    ], [state])
    const setHeader = useSetRecoilState(headerAtom)
    useEffect(() => {
        setHeader({ sidebar: false })
        return () => {
            setHeader({ sidebar: true })
        }
    }, [])
    return (
        <>
            <FormStepper.Root vertical activeStep={activeStep}>
                <FormStepper.Stepper>
                    <div style={{}}>

                        <ButtonBase label={'processo de seleção'} onClick={() => navigate(-1)} />
                    </div>
                    {steps.map((e, i) => {
                        const Icon = e.icon
                        return (
                            <FormStepper.Step key={i} index={i + 1} label={e.label} onClick={() => handleChangeCategory(i + 1)}>
                                <Icon style={{ clipPath: 'circle()' }} />
                            </FormStepper.Step>
                        )
                    })}
                </FormStepper.Stepper>

                {

                    steps.map((e, i) => {
                        const Component = e.component
                        return (
                            <FormStepper.View key={e.label} index={i + 1}>
                                <Component candidateId={state?.candidateId} applicationId={state?.applicationId} />
                            </FormStepper.View>
                        )
                    })
                }

            </FormStepper.Root>
        </>
    )
}