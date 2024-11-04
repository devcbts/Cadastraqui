import AdminSidebar from "Components/Admin/Sidebar"
import CandidateSidebar from "Components/Candidate/Sidebar"
import EntitySidebar from "Components/Entity/Sidebar"
import SocialAssistantSidebar from "Components/SocialAssistant/Sidebar"
import useAuth from "hooks/useAuth"
import { memo, useMemo } from "react"

const SidebarSelection = () => {
    const { auth } = useAuth()
    const CurrentSidebar = useMemo(() => {
        switch (auth?.role) {
            case "CANDIDATE":
            case "RESPONSIBLE":
                return CandidateSidebar
            case "ASSISTANT":
                return SocialAssistantSidebar
            case "ENTITY":
            case "ENTITY_DIRECTOR":
                return EntitySidebar
            case "ADMIN":
                return AdminSidebar
            default:
                return null
        }
    }, [auth?.role])
    return CurrentSidebar ? <CurrentSidebar /> : null
}

export default memo(SidebarSelection)