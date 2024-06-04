import styles from './styles.module.scss'
export default function TableCell({ divider, children }) {
    const dividerStyle = divider ? styles.divider : ''
    return (
        <td className={[styles.container, dividerStyle].join(' ')}>
            <div className={styles.content}>
                {children}
            </div>
        </td>
    )
}