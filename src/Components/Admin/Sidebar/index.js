import Sidebar from "Components/Sidebar";
import { ReactComponent as Add } from '../../../Assets/icons/fileCirclePlus.svg';
import { ReactComponent as Home } from '../../../Assets/icons/home.svg';
import { ReactComponent as Help } from '../../../Assets/icons/question-mark.svg';
import { ReactComponent as Profile } from '../../../Assets/icons/profile.svg';
export default function AdminSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Add} text={'cadastro'} path={'/cadastro'}></Sidebar.Item>
            <Sidebar.Item icon={Home} text={'gestão'} path={'/contas'}></Sidebar.Item>
            <Sidebar.Item icon={Help} text={'SAC'} path={'/sac'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'Perfil'} path={'/profile'}></Sidebar.Item>
        </Sidebar.Root>
    )
}