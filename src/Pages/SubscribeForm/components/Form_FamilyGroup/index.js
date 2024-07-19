import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
import AdditionalDocuments from "../AdditionalDocuments";
import AdditionalInfo from "../AdditionalInfo";
import Benefits from "../Benefits";
import Document from "../Document";
import MaritalStatus from "../MaritalStatus";
import PersonalData from "../PersonalData";
import PersonalInformation from "../PersonalInformation";
import FamilyRelation from "./components/FamilyRelation";
import MembersList from "./components/MembersList";
export default function FormFamilyGroup() {
    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const uploadMemberDocument = async (data, memberId) => {
        try {
            const formData = createFileForm(data)
            await uploadService.uploadBySectionAndId({ section: 'family-member', id: memberId }, formData)

        } catch (err) {

        }
    }
    const handleSaveFamilyMember = async (data) => {
        setIsLoading(true)
        try {
            const id = await candidateService.registerFamilyMember(data)
            await uploadMemberDocument(data, id)
            setData(null)
            setIsAdding(false)
            setActiveStep(1)
            NotificationService.success({ text: 'Parente cadastrado' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)
    }
    const handleEditFamilyMember = async (data) => {
        try {
            await candidateService.updateFamilyMember(data.id, data);
            await uploadMemberDocument(data, data.id)
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
    }

    const {
        Steps,
        max,
        actions: { handleEdit },
        state: { activeStep, setData, setActiveStep, data },
        pages: { previous, next }
    } = useStepFormHook({
        render: [
            FamilyRelation,
            PersonalData,
            AdditionalInfo,
            MaritalStatus,
            PersonalInformation,
            Document,
            AdditionalDocuments,
            Benefits
        ],
        onEdit: handleEditFamilyMember,
        onSave: handleSaveFamilyMember,
        tooltips: {
            1: {
                landlinePhone: 'Caso seja menor de idade, utilize o telefone do responsável',
                email: 'Caso seja menor de idade, utilize o email do responsável',
            }
        }
    })

    const handlePrevious = () => {
        if (activeStep === 1) {
            setIsAdding(false)
            setData(null)
            return
        }
        previous()
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
                    <Steps />
                    <div className={commonStyles.actions}>
                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>
                        {(data && !isAdding) &&
                            <ButtonBase onClick={handleEdit} label={"editar"} />
                        }
                        {activeStep !== max &&
                            <ButtonBase onClick={next}>
                                <Arrow width="30px" />
                            </ButtonBase>
                        }
                        {
                            (activeStep === max && isAdding) && (
                                <ButtonBase onClick={next}>
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