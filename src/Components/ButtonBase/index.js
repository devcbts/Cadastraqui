import styles from './styles.module.scss'
export default function ButtonBase({
    label,
    onClick,
    children,
    danger = false,
    ...props
}) {
    const dangerStyle = danger ? styles.danger : ''
    return (
        <button
            className={[styles.button, dangerStyle].join(' ')}
            onClick={onClick}
            {...props}
        >
            {children ?? label}
        </button>
    )
}