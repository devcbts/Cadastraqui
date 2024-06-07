import styles from './styles.module.scss'
export default function TableCell({ children }) {
    return (
        <td className={styles.container}>
            <div className={styles.content}>
                {children}
            </div>
        </td>
    )
}