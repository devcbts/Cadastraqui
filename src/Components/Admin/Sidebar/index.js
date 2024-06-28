import Sidebar from "Components/Sidebar";
import { ReactComponent as Add } from '../../../Assets/icons/fileCirclePlus.svg';
export default function AdminSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Add} text={'cadastro de entidade'} path={'/cadastro'}></Sidebar.Item>
        </Sidebar.Root>
    )
}