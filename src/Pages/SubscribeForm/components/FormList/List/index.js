import styles from './styles.module.scss'
export default function List({
    list,
    text,
    render,
}) {
    return (
        <>
            {list.length > 0 && (
                <div className={styles.list}>
                    {list.map(render)}
                </div>
            )}
            {list.length === 0 && (
                <p className={styles.emptytext}>{text}</p>
            )}
        </>

    )
}