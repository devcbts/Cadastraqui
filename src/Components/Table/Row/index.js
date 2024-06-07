import styles from './styles.module.scss'
export default function TableRow({ children }) {
    return (
        <tr className={styles.container}>
            {children}
        </tr>
    )
}