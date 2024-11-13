import { useState } from 'react'
import styles from './styles.module.scss'
import { ReactComponent as Loading } from 'Assets/icons/loading.svg'
import Spinner from 'Components/Loader/Spinner'

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
        // Check if current called onClick is one of 'AsyncFunction'
        if (!onClick) {
            return
        }
        const { constructor: { name } } = onClick
        const isAsync = name === "AsyncFunction"
        if (isAsync) {
            setLoading(true)
        }
        await onClick?.()
        if (isAsync) {
            setLoading(false)
        }

    }
    return (
        <button
            disabled={isLoading}
            className={[styles.button, dangerStyle].join(' ')}
            onClick={!isLoading ? handleClick : null}
            {...props}
            type={props.type ?? "button"}
        >
            {isLoading ? <Spinner size='20' />
                : children ?? <span>{label}</span>
            }

        </button>
    )
}