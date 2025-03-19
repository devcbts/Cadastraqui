import Sidebar from "Components/Sidebar";
import { ReactComponent as Legal } from '../../../Assets/icons/legal.svg';
export default function LawyerSidebar() {
    return (
        <Sidebar.Root>
            <Sidebar.Item icon={Legal} text={'arquivos legais'} path={'/arquivos'}></Sidebar.Item>
        </Sidebar.Root>
    )
}