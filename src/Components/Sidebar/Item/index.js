import { useLocation, useNavigate } from 'react-router'
import styles from './styles.module.scss'
export default function SidebarItem({ icon: Icon, text, path, onClick }) {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isActive = pathname.includes(path) ? styles.active : ''
    const handleClick = () => {
        if (!onClick) {
            return navigate(path)
        }
        return onClick()
    }
    return (
        <button className={[styles.container, isActive].join(' ')} onClick={handleClick}>
            <Icon width={30} height={30} />
            <span className={styles.text}>{text}</span>
        </button>
    )
}