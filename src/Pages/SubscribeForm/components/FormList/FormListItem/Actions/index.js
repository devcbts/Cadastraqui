import styles from './styles.module.scss'

export default function FormListItemActions({ children }) {
    return (
        <div className={styles.actions}>
            {children}
        </div>
    )
}