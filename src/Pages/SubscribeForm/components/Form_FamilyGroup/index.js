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
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
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
                            <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>
                        {(data && !isAdding) &&
                            <ButtonBase onClick={handleEdit} label={"editar"} />
                        }
                        {activeStep !== max &&
                            <ButtonBase onClick={next}>
                                <Arrow width="40px" />
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