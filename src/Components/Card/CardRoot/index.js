import styles from './styles.module.scss'
export default function CardRoot({ onClick = null, children }) {
    return (
        <div className={styles.root}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick} role={onClick ? 'button' : 'div'}>
            <div className={styles.container}>
                {children}
            </div>
        </div>
    )
}