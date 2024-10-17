import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import AdditionalDocuments from "Pages/SubscribeForm/components/AdditionalDocuments"
import AdditionalInfo from "Pages/SubscribeForm/components/AdditionalInfo"
import Benefits from "Pages/SubscribeForm/components/Benefits"
import Document from "Pages/SubscribeForm/components/Document"
import FamilyRelation from "Pages/SubscribeForm/components/Form_FamilyGroup/components/FamilyRelation"
import MaritalStatus from "Pages/SubscribeForm/components/MaritalStatus"
import PersonalData from "Pages/SubscribeForm/components/PersonalData"
import PersonalInformation from "Pages/SubscribeForm/components/PersonalInformation"
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useEffect, useState } from "react"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import MemberList from "./components/MemberList"
import applicationService from 'services/application/applicationService'
export default function ViewFamilyGroup({ candidateId, applicationId }) {
    const [familyMembers, setFamilyMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsLoading(true)
                const information = await applicationService.getCandidateFamilyGroup(applicationId)

                setFamilyMembers(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchMembers()
    }, [applicationId])

    const {
        Steps,
        max,
        state: { activeStep, setData, data },
        pages: { previous, next }
    } = useStepFormHook({
        render: [
            FamilyRelation,
            PersonalData,
            AdditionalInfo,
            MaritalStatus,
            PersonalInformation,
            Document,
            AdditionalDocuments,
            Benefits
        ],
        viewMode: true
    })
    const handleSelectMember = (member) => {
        setData(member)
    }
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            return
        }
        previous()
    }
    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            {!data && <MemberList members={familyMembers} onSelect={handleSelectMember} />}
            {data && (
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
            )}


        </div >
    )
}