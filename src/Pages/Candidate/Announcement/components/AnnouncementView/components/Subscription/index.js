import { useContext } from "react"
import AnnouncementContext from "../../context/announcementContext"
import StartSubscription from "./components/Start"
import SubscriptionForm from "./components/Form"

export default function Subscription() {
    const { step } = useContext(AnnouncementContext)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {step === 'START_SUB' && <StartSubscription />}
            {step === 'FORM' && <SubscriptionForm />}
        </div>
    )
}