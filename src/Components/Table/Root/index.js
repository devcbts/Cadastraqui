import styles from './styles.module.scss'
export default function TableRoot({ headers = [], children }) {
    return (
        <table className={styles.container}>
            {
                headers.map((header) => (
                    <th className={styles.header}>{header}</th>
                ))
            }
            <tbody>
                {children}
            </tbody>
        </table>
    )
}