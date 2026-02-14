import Spinner from 'Components/Loader/Spinner'
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
    const isDisabled = isLoading || props.disabled
    const handleClick = async (e) => {
        // Check if current called onClick is one of 'AsyncFunction'
        if (!onClick) {
            return
        }
        const { constructor: { name } } = onClick
        const isAsync = name === "AsyncFunction"
        if (isAsync) {
            setLoading(true)
        }
        await onClick?.(e)
        if (isAsync) {
            setLoading(false)
        }

    }
    return (
        <button
            disabled={isDisabled}
            className={[styles.button, dangerStyle].join(' ')}
            onClick={!isDisabled ? handleClick : null}
            {...props}
            type={props.type ?? "button"}
        >
            {isLoading ? <Spinner size='20' />
                : children ?? <span>{label}</span>
            }

        </button>
    )
}