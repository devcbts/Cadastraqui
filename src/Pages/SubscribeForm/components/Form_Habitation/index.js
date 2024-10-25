import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from 'Components/ButtonBase';
import Loader from 'Components/Loader';
import useAuth from 'hooks/useAuth';
import useStepFormHook from 'Pages/SubscribeForm/hooks/useStepFormHook';
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from 'react';
import candidateService from 'services/candidate/candidateService';
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import createFileForm from 'utils/create-file-form';
import PropertyInfo from './components/PropertyInfo';
import PropertyStatus from './components/PropertyStatus';
import useSubscribeFormPermissions from 'Pages/SubscribeForm/hooks/useSubscribeFormPermissions';

export default function FormHabitation() {
    const [isLoading, setIsLoading] = useState(false)
    const [enableEditing, setEnableEditing] = useState(false)
    const { canEdit, service } = useSubscribeFormPermissions()
    const { auth } = useAuth()
    const uploadHabitationDocuments = async (data, rowId) => {
        const formData = createFileForm(data)
        try {
            await uploadService.uploadBySectionAndId({ section: 'housing', id: rowId }, formData)
            if (data.sign_housing.email && data.sign_housing.file) {
                const values = new FormData()
                values.append("emails", JSON.stringify([data.sign_housing.email]))
                values.append("file", data.sign_housing.file)
                await uploadService.uploadMemberDocumentToSign({ section: 'housing', id: rowId }, values)

            }
        } catch (err) {

        }
    }
    const handleEditHouse = async (data) => {
        setIsLoading(true)
        try {
            await candidateService.updateHousingInfo(data)
            await uploadHabitationDocuments(data, data.uid)
            NotificationService.success({ text: 'Informações editadas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)

    }
    const handleSaveHouse = async (data) => {
        try {
            await candidateService.registerHousingInfo(data)
            await uploadHabitationDocuments(data, auth?.uid)
            NotificationService.success({ text: 'Dados de moradia cadastrados' })
            setEnableEditing(true)
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
    }
    const {
        state: { activeStep, setData },
        pages: { previous, next },
        actions: { handleEdit },
        max,
        Steps
    } = useStepFormHook({
        render: [
            PropertyStatus,
            PropertyInfo
        ],
        onEdit: handleEditHouse,
        onSave: handleSaveHouse,
        viewMode: !canEdit,
    })
    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const information = await service?.getHousingInfo()
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
            <fieldset disabled={!canEdit}>

                <Steps />
            </fieldset>
            <div className={commonStyles.actions}>
                {activeStep !== 1 &&
                    <ButtonBase onClick={previous}>
                        <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                {(enableEditing && canEdit) &&
                    <ButtonBase onClick={handleEdit} label={"editar"} />
                }
                {activeStep !== max &&
                    <ButtonBase onClick={next}>
                        <Arrow width="30px" />
                    </ButtonBase>
                }
                {
                    (activeStep === max && !enableEditing && canEdit) && (
                        <ButtonBase onClick={next}>
                            Salvar
                        </ButtonBase>
                    )
                }
            </div>
        </div >
    )
}