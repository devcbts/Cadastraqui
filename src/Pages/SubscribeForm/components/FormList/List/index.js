import styles from './styles.module.scss'
export default function List({
    list,
    text,
    render,
}) {
    return (
        <div className={styles.list}>
            {list.length > 0 && (
                <>
                    {list.map(render)}
                </>
            )}
            {list.length === 0 && (
                <p className={styles.emptytext}>{text}</p>
            )}
        </div>

    )
}