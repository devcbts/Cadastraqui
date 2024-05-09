import { createRef, useEffect, useMemo, useRef, useState } from "react";
import FormStepper from "Components/FormStepper";
import PersonalData from "../PersonalData";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import AdditionalInfo from "../AdditionalInfo";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import MaritalStatus from "../MaritalStatus";
import PersonalInformation from "../PersonalInformation";
import Document from "../Document";
import Benefits from "../Benefits";
import candidateService from "services/candidate/candidateService";
import AdditionalDocuments from "../AdditionalDocuments";
import Loader from "Components/Loader";
import { NotificationService } from "services/notification";
import FamilyRelation from "./components/FamilyRelation";
import MembersList from "./components/MembersList";
export default function FormFamilyGroup() {
    const itemsToRender = [
        FamilyRelation,
        PersonalData,
        AdditionalInfo,
        MaritalStatus,
        PersonalInformation,
        Document,
        AdditionalDocuments,
        Benefits
    ]
    const MAX_STEPS = itemsToRender.length;
    const [activeStep, setActiveStep] = useState(1)
    const [data, setData] = useState(null)
    const [isAdding, setIsAdding] = useState(false)
    const { current: stepsRef } = useRef(Array.from({ length: MAX_STEPS }).fill(createRef()))
    const [isLoading, setIsLoading] = useState(false)
    const getCurrentRef = () => stepsRef[activeStep - 1].current
    const isFormValid = () => getCurrentRef().validate()
    const handleEdit = async () => {
        if (!isFormValid()) {
            return
        }
        const dataToUpdate = getCurrentRef().values()
        try {
            await candidateService.updateFamilyMember(data.id, dataToUpdate);
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
    }
    const handleSave = async () => {
        try {
            setIsLoading(true)
            await candidateService.registerFamilyMember(data)
            setData(null)
            setIsAdding(false)
            setActiveStep(1)
            NotificationService.success({ text: 'Parente cadastrado' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)
    }
    const handleNext = () => {
        if (isFormValid()) {
            setData((prevData) => ({ ...prevData, ...getCurrentRef().values() }))
            switch (activeStep) {
                case MAX_STEPS:
                    handleSave()
                    break;
                default:
                    setActiveStep((prevState) => prevState + 1)
                    break;
            }
        }
    }
    const handlePrevious = () => {
        if (activeStep === 1) {
            setIsAdding(false)
            setData(null)
            return
        }
        setActiveStep((prevState) => prevState - 1)
    }

    const handleSelectMember = (member) => {
        setData(member)
    }
    const handleAddMember = () => {
        setData(null)
        setIsAdding(true)
    }
    const hasSelectionOrIsAdding = () => {
        return data || isAdding
    }

    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            {!hasSelectionOrIsAdding() && <MembersList onSelect={handleSelectMember} onAdd={handleAddMember} />}
            {hasSelectionOrIsAdding() && (
                <>
                    <FormStepper.Root activeStep={activeStep}>
                        <FormStepper.Stepper >
                            {Array.from({ length: MAX_STEPS }).map((_, i) => (
                                <FormStepper.Step key={i} index={i + 1}>{i + 1}</FormStepper.Step>
                            ))}
                        </FormStepper.Stepper>
                        {itemsToRender.map((e, index) => {
                            const Component = e
                            return (
                                <FormStepper.View index={index + 1}>
                                    <Component data={data} ref={stepsRef[index]} />
                                </FormStepper.View>
                            )
                        })}
                    </FormStepper.Root>
                    <div className={commonStyles.actions}>
                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>
                        {(data && !isAdding) &&
                            <ButtonBase onClick={handleEdit} label={"editar"} />
                        }
                        {activeStep !== MAX_STEPS &&
                            <ButtonBase onClick={handleNext}>
                                <Arrow width="40px" />
                            </ButtonBase>
                        }
                        {
                            (activeStep === MAX_STEPS && isAdding) && (
                                <ButtonBase onClick={handleNext}>
                                    Salvar
                                </ButtonBase>
                            )
                        }
                    </div>
                </>
            )}


        </div >
    )
}