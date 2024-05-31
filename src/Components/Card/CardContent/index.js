import styles from './styles.module.scss'
export default function CardContent({ children }) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}