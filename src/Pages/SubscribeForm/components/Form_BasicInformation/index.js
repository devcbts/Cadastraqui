import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
import AdditionalDocuments from "../AdditionalDocuments";
import AdditionalInfo from "../AdditionalInfo";
import AddressData from "../AddressData";
import Benefits from "../Benefits";
import Document from "../Document";
import MaritalStatus from "../MaritalStatus";
import PersonalData from "../PersonalData";
import PersonalInformation from "../PersonalInformation";
export default function FormBasicInformation() {
    const { auth } = useAuth()
    const uploadDocuments = async (userId, data) => {
        const formData = createFileForm(data)
        try {
            await uploadService.uploadBySectionAndId({ section: 'identity', id: userId }, formData)
        } catch (err) {
            await NotificationService.error({ text: 'Erro ao enviar arquivos' })
        }
    }

    const handleEditInformation = async (data) => {
        try {
            await candidateService.updateIdentityInfo(data);
            await uploadDocuments(data.uid, data)
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const handleSaveInformation = async (_, data) => {
        setIsLoading(true)
        try {
            await candidateService.registerIdentityInfo(data)
            NotificationService.success({ text: 'Informações cadastradas' })
            await uploadDocuments(auth?.uid, data)
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
                setData(information)
                if (information) {
                    setEnableEditing(true)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [setData])

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