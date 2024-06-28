import Sidebar from "Components/Sidebar";
import { ReactComponent as Add } from '../../../Assets/icons/fileCirclePlus.svg';
export default function AdminSidebar() {
    return (
        <Sidebar.Root>
            {/* <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item> */}
            <Sidebar.Item icon={Add} text={'cadastro'} path={'/cadastro'}></Sidebar.Item>
            {/* <Sidebar.Item icon={Profile} text={'perfil'} path={'/profile'}></Sidebar.Item> */}
        </Sidebar.Root>
    )
}