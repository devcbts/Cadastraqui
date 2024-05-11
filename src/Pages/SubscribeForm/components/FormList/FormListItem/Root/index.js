import styles from './styles.module.scss'
export default function FormListItemRoot({ text, children }) {

    return (
        <div className={styles.container}>
            <label className={styles.label}>{text}</label>
            {children}
        </div>
    )
}