import { ReactComponent as Car } from 'Assets/icons/car.svg';
import { ReactComponent as Currency } from 'Assets/icons/currency.svg';
import { ReactComponent as Doctor } from 'Assets/icons/doctor.svg';
import { ReactComponent as Family } from 'Assets/icons/family.svg';
import { ReactComponent as House } from 'Assets/icons/house.svg';
import { ReactComponent as List } from 'Assets/icons/list.svg';
import { ReactComponent as Money } from 'Assets/icons/money.svg';
import { ReactComponent as User } from 'Assets/icons/user.svg';
import FormStepper from "Components/FormStepper";
import headerAtom from "Components/Header/atoms/header-atom";
import { useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import FormBasicInformation from "./components/Form_BasicInformation";
import FormDeclarations from "./components/Form_Declarations";
import FormExpenses from "./components/Form_Expenses";
import FormFamilyGroup from "./components/Form_FamilyGroup";
import FormHabitation from "./components/Form_Habitation";
import FormHealth from "./components/Form_Health";
import FormIncome from "./components/Form_Income";
import FormVehicle from "./components/Form_Vehicle";
import { useLocation, useNavigate } from 'react-router';
import candidateService from 'services/candidate/candidateService';
import useSubscribeFormPermissions from './hooks/useSubscribeFormPermissions';
import candidateViewAtom from 'Components/CandidateView/atom/candidateViewAtom';
import ButtonBase from 'Components/ButtonBase';
import useAuth from 'hooks/useAuth';
import ViewDeclarations from 'Components/CandidateView/components/View_Declarations';
export default function SubscribeForm({ backButtonText = "" }) {
    const [activeStep, setActiveStep] = useState(1)
    const [completed, setCompleted] = useState([])
    const navigate = useNavigate()
    const { state } = useLocation()
    const handleChangeCategory = (index) => {
        setActiveStep(index)
    }
    const { auth } = useAuth()
    const candidateType = ["CANDIDATE", "RESPONSIBLE"].includes(auth?.role)
    const steps = useMemo(() =>
        [
            { label: "Cadastrante", icon: User, component: FormBasicInformation, section: 'cadastrante' },
            { label: "Grupo Familiar", icon: Family, component: FormFamilyGroup, section: 'grupoFamiliar' },
            { label: "Moradia", icon: House, component: FormHabitation, section: 'moradia' },
            { label: "Veículo", icon: Car, component: FormVehicle, section: 'veiculos' },
            { label: "Renda", icon: Currency, component: FormIncome, section: 'rendaMensal' },
            { label: "Gastos", icon: Money, component: FormExpenses, section: 'despesas' },
            { label: "Saúde", icon: Doctor, component: FormHealth, section: 'saude' },
            {
                label: "Declarações", icon: List, component:
                    candidateType ? FormDeclarations : ViewDeclarations
                , section: 'declaracoes'
            },
            // { label: "_", icon: Edit },
        ]
        , [])
    const setHeader = useSetRecoilState(headerAtom)
    const setCandidateView = useSetRecoilState(candidateViewAtom)
    useEffect(() => {
        setHeader({ sidebar: false })
        setCandidateView({ currentApplication: state?.applicationId ?? '', currentCandidate: state?.candidateId ?? '' })
        if (state?.step) {
            setActiveStep(state?.step)
        }
        return () => {
            setHeader({ sidebar: true })
        }
    }, [])
    useEffect(() => {
        if (!candidateType) { return }
        candidateService.getProgress().then(setCompleted).catch(_ => { })
    }, [activeStep])
    return (
        <FormStepper.Root vertical activeStep={activeStep}>
            <FormStepper.Stepper>
                {!!backButtonText && <div style={{}}>
                    <ButtonBase label={backButtonText} onClick={() => navigate(-1)} />
                </div>}
                {steps.map((e, i) => {
                    const Icon = e.icon
                    return (
                        <FormStepper.Step completed={completed[e.section]} key={e.section} index={i + 1} label={e.label} onClick={() => handleChangeCategory(i + 1)}>
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
                            <Component />
                        </FormStepper.View>
                    )
                })
            }

        </FormStepper.Root>
    )
}