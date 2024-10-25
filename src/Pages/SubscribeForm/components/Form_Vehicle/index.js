import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import VehicleData from "./components/VehicleData";
import VehicleInsurance from "./components/VehicleInsurance";
import VehicleList from "./components/VehicleList";
import VehicleSituation from "./components/VehicleSituation";
import useSubscribeFormPermissions from 'Pages/SubscribeForm/hooks/useSubscribeFormPermissions';
export default function FormVehicle() {
    const { canEdit, service } = useSubscribeFormPermissions()
    const handleEditVehicle = async (data, updated) => {
        setIsLoading(true)
        try {
            await candidateService.updateVehicle(data.id, updated);
            NotificationService.success({ text: 'Veículo alterado' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
        setIsLoading(false)
    }
    const handleSaveVehicle = async (data) => {
        setIsLoading(true)
        try {
            await candidateService.registerVehicle(data)
            NotificationService.success({ text: `Veículo ${data.modelAndBrand} cadastrado` })
            setActiveStep(1)
            setData(null)
            setIsAdding(false)
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)
    }
    const {
        Steps,
        pages: { previous, next },
        actions: { handleEdit },
        state: { activeStep, data, setData, setActiveStep },
        max
    } = useStepFormHook({
        render: [
            VehicleData,
            VehicleSituation,
            VehicleInsurance
        ],
        onEdit: handleEditVehicle,
        onSave: handleSaveVehicle,
        viewMode: !canEdit,
    })

    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleSelectVehicle = (vehicle) => {
        setData(vehicle)
    }
    const handleAddVehicle = () => {
        setData(null)
        setIsAdding(true)
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
    const handleDeleteVehicle = async (id) => {
        try {
            await candidateService.deleteVehicle(id)
            NotificationService.success({ text: 'Veículo excluído' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            {!hasSelectionOrIsAdding() && <VehicleList onSelect={handleSelectVehicle} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />}
            {hasSelectionOrIsAdding() &&
                <>
                    <fieldset disabled={!canEdit}>

                        <Steps />
                    </fieldset>
                    <div className={commonStyles.actions}>
                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>
                        {(data && !isAdding && canEdit) &&
                            <ButtonBase onClick={handleEdit} label={"editar"} />
                        }
                        {activeStep !== max &&
                            <ButtonBase onClick={next}>
                                <Arrow width="30px" />
                            </ButtonBase>
                        }
                        {
                            (activeStep === max && isAdding && canEdit) && (
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