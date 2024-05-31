import styles from './styles.module.scss'
export default function CardHeader({ children }) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}