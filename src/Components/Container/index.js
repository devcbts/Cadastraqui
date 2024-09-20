import styles from './styles.module.scss'
export default function Container({ title, desc, children }) {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>{title}</h1>
                <span>{desc}</span>
            </div>
            <div className={styles.child}>
                {children}
            </div>
        </div>
    )
}