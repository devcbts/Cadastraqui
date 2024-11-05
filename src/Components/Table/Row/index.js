import styles from './styles.module.scss'
export default function TableRow({ children, ...props }) {
    return (
        <tr className={styles.container} {...props}>
            {children}
        </tr>
    )
}