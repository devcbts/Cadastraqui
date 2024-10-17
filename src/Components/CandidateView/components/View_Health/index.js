import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import HealthDisease from "Pages/SubscribeForm/components/Form_Health/components/HealthDisease";
import HealthMedication from "Pages/SubscribeForm/components/Form_Health/components/HealthMedication";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import HealthList from "./components/HealthList";
import applicationService from 'services/application/applicationService';

export default function ViewHealth({ applicationId }) {
    const [isLoading, setIsLoading] = useState(true)

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
        viewMode: true

    })

    const [isAdding, setIsAdding] = useState(false)

    const selectDisease = (item) => {
        //TODO: when user selects (health info exists) redirect to another page to list all diseases
        setData({ memberId: item.id, ...item })
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
                const members = await applicationService.getHealthInfo(applicationId)
                if (members) {
                    setMembers(members)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [applicationId])
    return (
        <div className={commonStyles.container}>
            {!data && <HealthList loading={isLoading} data={members} onSelect={selectDisease} />}
            {data &&
                <>
                    <fieldset disabled>
                        <Steps />
                    </fieldset>
                    <div className={commonStyles.actions}>

                        <ButtonBase onClick={handlePrevious}>
                            <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                        </ButtonBase>


                        {activeStep !== max &&
                            <ButtonBase onClick={next}>
                                <Arrow width="30px" />
                            </ButtonBase>
                        }

                    </div>
                </>
            }


        </div >
    )
}