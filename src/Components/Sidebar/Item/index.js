import { useLocation, useNavigate } from 'react-router'
import styles from './styles.module.scss'
export default function SidebarItem({ icon: Icon, text, path, onClick }) {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isActive = pathname.split('/').at(1) === path?.split('/').at(1) ? styles.active : ''
    const handleClick = () => {
        if (!onClick) {
            return navigate(path)
        }
        return onClick()
    }
    return (
        <button tabIndex={0} aria-label={text} className={[styles.container, isActive].join(' ')} onClick={handleClick}>
            <Icon />
            <span className={styles.text}>{text}</span>
        </button>
    )
}