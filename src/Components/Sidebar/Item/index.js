import styles from './styles.module.scss'
export default function SidebarItem({ icon: Icon, text, onClick, active }) {
    const isActive = active ? styles.active : ''
    return (
        <div className={[styles.container, isActive].join(' ')} onClick={onClick} role="button">
            <Icon width={30} height={30} />
            <span className={styles.text}>{text}</span>
        </div>
    )
}