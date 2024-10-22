import { ReactComponent as Home } from "Assets/icons/home.svg";
import { ReactComponent as Profile } from "Assets/icons/profile.svg";
import { ReactComponent as Calendar } from "Assets/icons/calendar.svg";
import { ReactComponent as Management } from "Assets/icons/list.svg";
import { ReactComponent as Magnifier } from "Assets/icons/magnifier.svg";
import { ReactComponent as Student } from "Assets/icons/student.svg";
import Sidebar from "Components/Sidebar";
export default function SocialAssistantSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Magnifier} text={'processos'} path={'/processos'}></Sidebar.Item>
            <Sidebar.Item icon={Calendar} text={'agenda'} path={'/agenda'}></Sidebar.Item>
            <Sidebar.Item icon={Management} text={'gerencial'} path={'/gerencial'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'perfil'} path={'/profile'}></Sidebar.Item>
            <Sidebar.Item icon={Student} text={'alunos'} path={'/alunos'}></Sidebar.Item>

        </Sidebar.Root>
    )
}