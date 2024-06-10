import Sidebar from "Components/Sidebar";
import { ReactComponent as Home } from "Assets/icons/home.svg"
export default function SocialAssistantSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'processo de seleção'} path={'/home'}></Sidebar.Item>
        </Sidebar.Root>
    )
}