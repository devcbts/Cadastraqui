import styles from './styles.module.scss'
export default function CardRoot({ children }) {
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {children}
            </div>
        </div>
    )
}