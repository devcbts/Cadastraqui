import { useContext } from "react"
import AnnouncementContext from "../../context/announcementContext"
import StartSubscription from "./components/Start"

export default function Subscription() {
    const { step } = useContext(AnnouncementContext)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {step === 'START_SUB' && <StartSubscription />}
        </div>
    )
}