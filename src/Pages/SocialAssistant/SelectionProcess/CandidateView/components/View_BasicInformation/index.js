import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import AdditionalDocuments from "Pages/SubscribeForm/components/AdditionalDocuments";
import AdditionalInfo from "Pages/SubscribeForm/components/AdditionalInfo";
import AddressData from "Pages/SubscribeForm/components/AddressData";
import Document from "Pages/SubscribeForm/components/Document";
import MaritalStatus from "Pages/SubscribeForm/components/MaritalStatus";
import PersonalData from "Pages/SubscribeForm/components/PersonalData";
import PersonalInformation from "Pages/SubscribeForm/components/PersonalInformation";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import { useEffect, useState } from "react";
import Benefits from "Pages/SubscribeForm/components/Benefits";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function ViewBasicInformation({ candidateId, applicationId }) {
    const [isLoading, setIsLoading] = useState(true)
    const {
        Steps,
        pages: { previous, next },
        max,
        state: { activeStep, data, setData }
    } = useStepFormHook({
        render: [
            PersonalData,
            AddressData,
            AdditionalInfo,
            MaritalStatus,
            PersonalInformation,
            Document,
            AdditionalDocuments,
            Benefits
        ],
        viewMode: true
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getCandidateIdentityInfo(applicationId)
                setData(information)
            } catch (err) {
                console.log(err)
            }
            setIsLoading(false)
        }
        fetchData()

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