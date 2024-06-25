import { useEffect, useState } from "react";
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
    const [isLoading, setIsLoading] = useState(true)
    // const handleEditInformation = async (data) => {
    //     try {
    //         await candidateService.updateIdentityInfo(data);
    //         NotificationService.success({ text: 'Informações alteradas' })
    //     } catch (err) {
    //         NotificationService.error({ text: err.response.data.message })

    //     }
    // }
    const handleSaveInformation = async (data) => {
        try {
            const { memberId, ...rest } = data
            let diseaseId = null
            if (data.hasDisease) {
                const response = await candidateService.registerHealthInfo(memberId, rest)
                diseaseId = response.data.id
            }
            if (data.controlledMedication) {
                await candidateService.registerMedicationInfo(memberId, { ...rest, familyMemberDiseaseId: diseaseId })
            }
            NotificationService.success({ text: 'Informações cadastradas' })
            setEnableEditing(true)
            setIsAdding(false)
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
        // onEdit: handleEditInformation,
        onSave: handleSaveInformation
    })

    const [enableEditing, setEnableEditing] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    const selectDisease = (item) => {
        //TODO: when user selects (health info exists) redirect to another page to list all diseases
        setData({ memberId: item.id, ...item })
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
    const [members, setMembers] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const members = await candidateService.getHealthInfo()
                if (members) {
                    setMembers(members)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    return (
        <div className={commonStyles.container}>
            {!hasSelectionOrIsAdding() && <HealthList loading={isLoading} data={members} onSelect={selectDisease} onAdd={addHealthInfo} />}
            {hasSelectionOrIsAdding() &&
                <>
                    <Steps />
                    <div className={commonStyles.actions}>

                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>

                        {/* {(enableEditing && !isAdding) &&
                            <ButtonBase onClick={handleEdit} label={"editar"} />
                        } */}
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