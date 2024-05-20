import { useState } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import HealthList from "./components/HealthList";
import HealthDisease from "./components/HealthDisease";
import HealthMedication from "./components/HealthMedication";
export default function FormHealth() {

    const handleEditInformation = async (data) => {
        try {
            await candidateService.updateIdentityInfo(data);
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const handleSaveInformation = async (data) => {
        try {
            console.log(data)
            const { memberId, ...rest } = data
            await candidateService.registerHealthInfo(memberId, rest)
            await candidateService.registerMedicationInfo(memberId, rest)
            NotificationService.success({ text: 'Informações cadastradas' })
            setEnableEditing(true)
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const {
        Steps,
        pages: { previous, next },
        actions: { handleEdit },
        max,
        state: { activeStep, data, setData }
    } = useStepFormHook({
        render: [
            HealthDisease,
            HealthMedication
        ],
        onEdit: handleEditInformation,
        onSave: handleSaveInformation
    })

    const [enableEditing, setEnableEditing] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    const selectMember = (item) => {
        //TODO: when user selects (health info exists) redirect to another page to list all diseases
        setData({ memberId: item.id, ...item.healthInfo })
    }
    const addHealthInfo = (item) => {
        const { id } = item
        setIsAdding(true)
        setData({ memberId: id })
    }
    const hasSelectionOrIsAdding = () => {
        return data || isAdding
    }
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            setIsAdding(false)
            return
        }
        previous()
    }
    return (
        <div className={commonStyles.container}>
            {!hasSelectionOrIsAdding() && <HealthList onSelect={selectMember} onAdd={addHealthInfo} />}
            {hasSelectionOrIsAdding() &&
                <>
                    <Steps />
                    <div className={commonStyles.actions}>
                        {activeStep !== 1 &&
                            <ButtonBase onClick={handlePrevious}>
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
                            (activeStep === max && isAdding) && (
                                <ButtonBase onClick={next}>
                                    Salvar
                                </ButtonBase>
                            )
                        }


                    </div>
                </>
            }


        </div >
    )
}