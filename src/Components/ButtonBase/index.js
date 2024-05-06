import styles from './styles.module.scss'
export default function ButtonBase({
    label,
    onClick,
    children,
    ...props
}) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            {...props}
        >
            {children ?? label}
        </button>
    )
}