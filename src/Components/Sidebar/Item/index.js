import { useLocation, useNavigate } from 'react-router'
import styles from './styles.module.scss'
export default function SidebarItem({ icon: Icon, text, path }) {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isActive = pathname === path ? styles.active : ''

    return (
        <button className={[styles.container, isActive].join(' ')} onClick={() => navigate(path)}>
            <Icon width={30} height={30} />
            <span className={styles.text}>{text}</span>
        </button>
    )
}