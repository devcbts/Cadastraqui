import { useState } from 'react'
import styles from './styles.module.scss'
export default function ButtonBase({
    label,
    onClick,
    children,
    danger = false,
    ...props
}) {
    const dangerStyle = danger ? styles.danger : ''
    const [isLoading, setLoading] = useState(false)
    const handleClick = async () => {
        setLoading(true)
        await onClick?.()
        setLoading(false)
    }
    return (
        <button
            disabled={isLoading}
            className={[styles.button, dangerStyle].join(' ')}
            onClick={!isLoading ? handleClick : null}
            {...props}
        >
            {children ?? label}
        </button>
    )
}