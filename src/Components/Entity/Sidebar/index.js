import Sidebar from "Components/Sidebar";
import { ReactComponent as Edit } from '../../../Assets/icons/edit.svg'
import { ReactComponent as Profile } from '../../../Assets/icons/profile.svg'
import { ReactComponent as Home } from '../../../Assets/icons/home.svg'
export default function EntitySidebar() {
    return (
        <Sidebar.Root>
            {/* <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item> */}
            <Sidebar.Item icon={Edit} text={'cadastro'} path={'/cadastro'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'editais'} path={'/editais'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'perfil'} path={'/profile'}></Sidebar.Item>
        </Sidebar.Root>
    )
}