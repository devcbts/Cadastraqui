import { createRef, useEffect, useMemo, useRef, useState } from "react";
import FormStepper from "Components/FormStepper";
import PersonalData from "../PersonalData";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import AddressData from "../AddressData";
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
export default function FormBasicInformation() {
    const itemsToRender = [
        PersonalData,
        AddressData,
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
    const [enableEditing, setEnableEditing] = useState(false)
    const { current: stepsRef } = useRef(Array.from({ length: MAX_STEPS }).fill(createRef()))
    const [isLoading, setIsLoading] = useState(true)
    const getCurrentRef = () => stepsRef[activeStep - 1].current
    const isFormValid = () => getCurrentRef().validate()
    const handleEdit = async () => {
        if (!isFormValid()) {
            return
        }
        const dataToUpdate = getCurrentRef().values()
        try {
            await candidateService.updateIdentityInfo(dataToUpdate);
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const handleSave = async () => {
        try {
            setIsLoading(true)
            await candidateService.registerIdentityInfo(data)
            NotificationService.success({ text: 'Informações cadastradas' })
            setEnableEditing(true)
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
                    console.log('default case')
                    setActiveStep((prevState) => prevState + 1)
                    break;
            }
        }
    }
    const handlePrevious = () => {
        setActiveStep((prevState) => prevState - 1)
    }
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const information = await candidateService.getIdentityInfo()
                if (information) {
                    setEnableEditing(true)
                    setData(information)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
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
                {activeStep !== 1 &&
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                {enableEditing &&
                    <ButtonBase onClick={handleEdit} label={"editar"} />
                }
                {activeStep !== MAX_STEPS &&
                    <ButtonBase onClick={handleNext}>
                        <Arrow width="40px" />
                    </ButtonBase>
                }
                {
                    (activeStep === MAX_STEPS && !enableEditing) && (
                        <ButtonBase onClick={handleNext}>
                            Salvar
                        </ButtonBase>
                    )
                }

            </div>


        </div >
    )
}