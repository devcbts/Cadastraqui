import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import HealthDisease from "./components/HealthDisease";
import HealthList from "./components/HealthList";
import HealthMedication from "./components/HealthMedication";
import METADATA_FILE_TYPE from 'utils/file/metadata-file-type';
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
            let medicationId = null
            if (data.hasDisease) {
                const response = await candidateService.registerHealthInfo(memberId, rest)
                diseaseId = response.data.id
            }

            if (data.file_disease && diseaseId) {
                const name = new Date().getTime()
                const metadata = {
                    [`metadata_laudo${name}`]: {
                        type: METADATA_FILE_TYPE.HEALTH.EXAM
                    }
                }
                const formData = new FormData()
                formData.append(`file_metadatas`, JSON.stringify(metadata))
                formData.append(`file_laudo${name}`, data.file_disease)
                await uploadService.uploadBySectionAndId({ section: 'health', id: data.memberId, tableId: diseaseId }, formData)
            }
            if (data.controlledMedication) {
                medicationId = await candidateService.registerMedicationInfo(memberId, { ...rest, familyMemberDiseaseId: diseaseId })
            }
            if (data.file_medication && medicationId) {
                const name = new Date().getTime()
                const metadata = {
                    [`metadata_laudo${name}`]: {
                        type: METADATA_FILE_TYPE.HEALTH.EXAM
                    }
                }
                const formData = new FormData()
                formData.append(`file_metadatas`, JSON.stringify(metadata))
                formData.append(`file_laudo${name}`, data.file_medication)
                await uploadService.uploadBySectionAndId({ section: 'medication', id: data.memberId, tableId: medicationId }, formData)
            }

            NotificationService.success({ text: 'Informações cadastradas' }).then(_ => setRefresh((prev) => !prev))
            setData(null)
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

    const [refresh, setRefresh] = useState(true)
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

    }, [refresh])
    return (
        <div className={commonStyles.container}>
            {!hasSelectionOrIsAdding() && <HealthList loading={isLoading} data={members} onSelect={selectDisease} onAdd={addHealthInfo}
                onRadioChange={(m) => setMembers(prev => [...prev].map(e => {
                    return e.id !== m.id ? e : m
                }))}
            />}
            {hasSelectionOrIsAdding() &&
                <>
                    <Steps />
                    <div className={commonStyles.actions}>

                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>

                        {/* {(enableEditing && !isAdding) &&
                            <ButtonBase onClick={handleEdit} label={"editar"} />
                        } */}
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
            }


        </div >
    )
}