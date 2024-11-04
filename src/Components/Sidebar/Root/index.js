import { ReactComponent as Exit } from 'Assets/icons/exit.svg';
import headerAtom from 'Components/Header/atoms/header-atom';
import useAuth from 'hooks/useAuth';
import { useRecoilValue } from 'recoil';
import SidebarItem from '../Item';
import styles from './styles.module.scss';

export default function SidebarRoot({ children }) {
    const { hiddenSidebar } = useRecoilValue(headerAtom);
    const { logout } = useAuth();
    return (
        <aside>
            <nav className={[styles.container, hiddenSidebar && styles.hide].join(' ')}>
                <div>
                    {children}
                </div>
                <SidebarItem onClick={logout} icon={Exit} text={'sair'} className={styles.logout} />
            </nav>
        </aside>
    );
}