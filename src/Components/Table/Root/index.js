import styles from './styles.module.scss'
export default function TableRoot({ headers = [], children }) {
    return (
        <table className={styles.container}>
            <thead>
                {
                    headers.map((header) => (
                        <th key={header} className={styles.header}>{header}</th>
                    ))
                }
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    )
}