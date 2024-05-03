import styles from './styles.module.scss'
export default function ButtonBase({
    label,
    onClick,
    ...props
}) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            {...props}
        >
            {label}
        </button>
    )
}