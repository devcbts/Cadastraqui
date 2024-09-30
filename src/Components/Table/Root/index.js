import styles from './styles.module.scss'
export default function TableRoot({ headers = [], title, children }) {
    return (
        <>
            {title && <h3>{title}</h3>}
            <table className={styles.container}>
                {
                    typeof headers !== 'number' &&

                    <thead>
                        <tr>
                            {
                                headers.map((header) => (
                                    <th key={header} className={styles.header}>{header}</th>
                                ))
                            }
                        </tr>
                    </thead>}
                <tbody>
                    {children}
                </tbody>
            </table>
        </>
    )
}