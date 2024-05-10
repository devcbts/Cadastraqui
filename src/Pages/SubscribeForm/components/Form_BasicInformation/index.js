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
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
export default function FormBasicInformation() {

    const handleEditInformation = async (data) => {
        try {
            await candidateService.updateIdentityInfo(data);
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const handleSaveInformation = async () => {
        setIsLoading(true)
        try {
            await candidateService.registerIdentityInfo(data)
            NotificationService.success({ text: 'Informações cadastradas' })
            setEnableEditing(true)
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
        setIsLoading(false)
    }
    const {
        Steps,
        pages: { previous, next },
        actions: { handleEdit },
        max,
        state: { activeStep, data, setData }
    } = useStepFormHook({
        render: [
            PersonalData,
            AddressData,
            AdditionalInfo,
            MaritalStatus,
            PersonalInformation,
            Document,
            AdditionalDocuments,
            Benefits
        ],
        onEdit: handleEditInformation,
        onSave: handleSaveInformation
    })

    const [enableEditing, setEnableEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

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
            <Steps />
            <div className={commonStyles.actions}>
                {activeStep !== 1 &&
                    <ButtonBase onClick={previous}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                {enableEditing &&
                    <ButtonBase onClick={handleEdit} label={"editar"} />
                }
                {activeStep !== max &&
                    <ButtonBase onClick={next}>
                        <Arrow width="40px" />
                    </ButtonBase>
                }
                {
                    (activeStep === max && !enableEditing) && (
                        <ButtonBase onClick={next}>
                            Salvar
                        </ButtonBase>
                    )
                }

            </div>


        </div >
    )
}