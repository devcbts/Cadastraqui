import { ReactComponent as Exit } from 'Assets/icons/exit.svg';
import headerAtom from 'Components/Header/atoms/header-atom';
import useAuth from 'hooks/useAuth';
import { useRecoilValue } from 'recoil';
import SidebarItem from '../Item';
import styles from './styles.module.scss';

export default function SidebarRoot({ children }) {
    const { sidebar } = useRecoilValue(headerAtom);
    const { logout } = useAuth();
    return (
        <div className={[styles.container, !sidebar && styles.hide].join(' ')}>
            <div>
                {children}
            </div>
            <SidebarItem onClick={logout} icon={Exit} text={'sair'} />
        </div>
    );
}