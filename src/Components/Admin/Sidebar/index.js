import Sidebar from "Components/Sidebar";
import { ReactComponent as Add } from '../../../Assets/icons/fileCirclePlus.svg';
import { ReactComponent as Home } from '../../../Assets/icons/home.svg';
import { ReactComponent as Help } from '../../../Assets/icons/question-mark.svg';
export default function AdminSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Add} text={'cadastro de entidade'} path={'/cadastro'}></Sidebar.Item>
            <Sidebar.Item icon={Help} text={'SAC'} path={'/sac'}></Sidebar.Item>
        </Sidebar.Root>
    )
}