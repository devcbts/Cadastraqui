import styles from './styles.module.scss'
export default function SidebarRoot({ children }) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}