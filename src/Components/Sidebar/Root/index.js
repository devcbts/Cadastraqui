import { useRecoilValue } from 'recoil'
import styles from './styles.module.scss'
import headerAtom from 'Components/Header/atoms/header-atom'
import SidebarItem from '../Item'
import { ReactComponent as Exit } from 'Assets/icons/exit.svg'
import useAuth from 'hooks/useAuth'
export default function SidebarRoot({ children }) {
    const { sidebar } = useRecoilValue(headerAtom)
    const { logout } = useAuth()
    return (
        <div className={[styles.container, !sidebar && styles.hide].join(' ')}>
            <div>
                {children}
            </div>
            <SidebarItem onClick={logout} icon={Exit} text={'sair'} />
        </div>
    )
}