import styles from './styles.module.scss'
export default function Card({ onClick = null, title, style, children, }) {
    const hasChildren = children !== null && children !== undefined
    return (
        <div className={styles.root}
            style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
            onClick={onClick} role={onClick ? 'button' : 'div'}>
            <div className={styles.container} style={{ minHeight: hasChildren ? '80px' : '40px' }}>
                {typeof title === "string" ? <span className={styles.title}>{title}</span> : <div>{title}</div>}
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}