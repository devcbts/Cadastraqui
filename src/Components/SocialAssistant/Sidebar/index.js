import { ReactComponent as Home } from "Assets/icons/home.svg";
import { ReactComponent as Profile } from "Assets/icons/profile.svg";
import Sidebar from "Components/Sidebar";
export default function SocialAssistantSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'processo seleção'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'perfil'} path={'/profile'}></Sidebar.Item>
        </Sidebar.Root>
    )
}