import styles from './styles.module.scss'
export default function CardTitle({ text }) {
    return (
        <div className={styles.container}>
            <span>{text}</span>
        </div>
    )
}