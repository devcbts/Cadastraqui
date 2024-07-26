import Sidebar from "Components/Sidebar";
import { ReactComponent as Add } from '../../../Assets/icons/fileCirclePlus.svg';
import { ReactComponent as Home } from '../../../Assets/icons/home.svg';
export default function AdminSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Add} text={'cadastro de entidade'} path={'/cadastro'}></Sidebar.Item>
        </Sidebar.Root>
    )
}