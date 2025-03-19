import Sidebar from "Components/Sidebar";
import { ReactComponent as Book } from '../../../Assets/icons/book.svg';
import { ReactComponent as Edit } from '../../../Assets/icons/edit.svg';
import { ReactComponent as Home } from '../../../Assets/icons/home.svg';
import { ReactComponent as Legal } from '../../../Assets/icons/legal.svg';
import { ReactComponent as List } from '../../../Assets/icons/list.svg';
import { ReactComponent as People } from '../../../Assets/icons/people.svg';
import { ReactComponent as Profile } from '../../../Assets/icons/profile.svg';
import { ReactComponent as Student } from '../../../Assets/icons/student.svg';
export default function EntitySidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Home} text={'início'} path={'/home'}></Sidebar.Item>
            <Sidebar.Item icon={Edit} text={'cadastro'} path={'/cadastro'}></Sidebar.Item>
            <Sidebar.Item icon={List} text={'editais'} path={'/editais'}></Sidebar.Item>
            <Sidebar.Item icon={Book} text={'matriculados'} path={'/matriculados'}></Sidebar.Item>
            <Sidebar.Item icon={Profile} text={'perfil'} path={'/profile'}></Sidebar.Item>
            <Sidebar.Item icon={People} text={'contas'} path={'/contas'}></Sidebar.Item>
            <Sidebar.Item icon={Student} text={'alunos'} path={'/alunos'}></Sidebar.Item>
            <Sidebar.Item icon={Legal} text={'arquivos legais'} path={'/arquivos'}></Sidebar.Item>
        </Sidebar.Root>
    )
}