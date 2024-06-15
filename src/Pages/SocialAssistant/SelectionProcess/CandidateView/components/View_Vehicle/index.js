import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import VehicleData from "Pages/SubscribeForm/components/Form_Vehicle/components/VehicleData";
import VehicleInsurance from "Pages/SubscribeForm/components/Form_Vehicle/components/VehicleInsurance";
import VehicleSituation from "Pages/SubscribeForm/components/Form_Vehicle/components/VehicleSituation";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import { useEffect, useState } from "react";
import VehicleList from "./components/VehicleList";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function ViewVehicle({ candidateId, applicationId }) {
    const [isLoading, setIsLoading] = useState(false)
    const {
        Steps,
        pages: { previous, next },
        state: { activeStep, data, setData },
        max
    } = useStepFormHook({
        render: [
            VehicleData,
            VehicleSituation,
            VehicleInsurance
        ],

    })
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            return
        }
        previous()
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getVehicleInfo(applicationId)
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [applicationId])
    const handleSelectVehicle = (vehicle) => {
        setData(vehicle)
    }
    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            {!data && <VehicleList onSelect={handleSelectVehicle} />}
            {data &&
                <>
                    <Steps />
                    <div className={commonStyles.actions}>
                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>



                        {activeStep !== max &&
                            <ButtonBase onClick={next}>
                                <Arrow width="40px" />
                            </ButtonBase>
                        }

                    </div>
                </>
            }
        </div >
    )
}