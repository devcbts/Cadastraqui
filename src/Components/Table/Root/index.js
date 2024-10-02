import styles from './styles.module.scss'
export default function TableRoot({ headers = [], title, children }) {
    // if (!children?.length) {
    //     return (
    //         <span> Esta tabela ainda não possui dados </span>
    //     )
    // }
    return (
        <>
            {title && <h3 className={styles.title}>{title}</h3>}
            <table className={styles.container}>
                {
                    typeof headers !== 'number' &&

                    <thead>
                        <tr>
                            {
                                headers.map((header, i) => (
                                    <th key={i} className={styles.header}>{header}</th>
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