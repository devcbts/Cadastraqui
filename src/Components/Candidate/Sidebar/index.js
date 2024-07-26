import Sidebar from "Components/Sidebar";
import { ReactComponent as Edit } from '../../../Assets/icons/edit.svg'
import { ReactComponent as Profile } from '../../../Assets/icons/profile.svg'
import { ReactComponent as Home } from '../../../Assets/icons/home.svg'
import { ReactComponent as Request } from '../../../Assets/icons/user_request.svg'
import { ReactComponent as Clock } from '../../../Assets/icons/clock.svg'
export default function CandidateSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Edit} text={'cadastro'} path={'/formulario-inscricao'}></Sidebar.Item>
            <Sidebar.Item icon={Request} text={'solicitações'} path={'/solicitacoes'}></Sidebar.Item>
            <Sidebar.Item icon={Clock} text={'histórico'} path={'/historico'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'perfil'} path={'/profile'}></Sidebar.Item>
        </Sidebar.Root>
    )
}