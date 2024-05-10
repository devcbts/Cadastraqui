import ButtonBase from 'Components/ButtonBase';
import FormStepper from 'Components/FormStepper';
import Loader from 'Components/Loader';
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import { createRef, useEffect, useRef, useState } from 'react';
import PropertyStatus from './components/PropertyStatus';
import PropertyInfo from './components/PropertyInfo';
import candidateService from 'services/candidate/candidateService';
import { NotificationService } from 'services/notification';
import useStepFormHook from 'Pages/SubscribeForm/hooks/useStepFormHook';

export default function FormHabitation() {
    const [isLoading, setIsLoading] = useState(false)
    const [enableEditing, setEnableEditing] = useState(false)
    const handleEditHouse = async (data) => {
        setIsLoading(true)
        try {
            await candidateService.updateHousingInfo(data)
            NotificationService.success({ text: 'Informações editadas' })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)

    }
    const handleSaveHouse = async (data) => {
        try {
            await candidateService.registerHousingInfo(data)
            NotificationService.success({ text: 'Dados de moradia cadastrados' })
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
        onSave: handleSaveHouse
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await candidateService.getHousingInfo()
                if (information) {
                    setEnableEditing(true)
                    setData(information)
                }
            } catch (err) {

            }
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