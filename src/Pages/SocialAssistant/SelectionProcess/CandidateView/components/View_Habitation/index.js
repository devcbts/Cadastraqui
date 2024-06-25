import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import PropertyInfo from "Pages/SubscribeForm/components/Form_Habitation/components/PropertyInfo"
import PropertyStatus from "Pages/SubscribeForm/components/Form_Habitation/components/PropertyStatus"
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook"
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useEffect, useState } from "react"
import socialAssistantService from "services/socialAssistant/socialAssistantService"

export default function ViewHabitation({ candidateId, applicationId }) {
    const [isLoading, setIsLoading] = useState(true)
    const {
        state: { activeStep, setData },
        pages: { previous, next },
        max,
        Steps
    } = useStepFormHook({
        render: [
            PropertyStatus,
            PropertyInfo
        ],
        viewMode: true

    })
    useEffect(() => {
        const fetchHousing = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getHousingInfo(applicationId)
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchHousing()
    }, [applicationId])
    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            <fieldset disabled>
                <Steps />
            </fieldset>
            <div className={commonStyles.actions}>
                {activeStep !== 1 &&
                    <ButtonBase onClick={previous}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                }
                {activeStep !== max &&
                    <ButtonBase onClick={next}>
                        <Arrow width="40px" />
                    </ButtonBase>
                }
            </div>
        </div >
    )
}