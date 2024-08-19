import { useContext } from 'react'
import styles from './styles.module.scss'
import { StepContext } from '../context'
export function FormStep({ index, label = '', onClick = null, children, completed = undefined }) {
    const { activeStep, vertical, reload } = useContext(StepContext)
    const activeStyle = activeStep === index ? styles.active : ''
    const completedStyle = (completed === undefined && activeStep > index) || (!!completed)
        ? styles.completed
        : ''
    const verticalStyle = vertical ? styles.vertical : ''
    const clickStyle = onClick ? styles.clickable : ''
    const handleClick = () => {
        if (onClick) {

            if (activeStep === index) {
                reload()
            }
            onClick()
        }
    }
    return (
        <div className={[styles.step, clickStyle].join(' ')}
            style={{ marginRight: vertical && 0 }}
            onClick={handleClick}
            role={onClick ? 'button' : 'div'}
            tabIndex={onClick ? 0 : null}
            aria-label={label}
            onKeyDown={(e) => {
                if (e.code === "Enter") { handleClick() }
            }}
        >
            <div className={[styles.contentwrapper, verticalStyle].join(' ')}>
                <div className={[styles.container, activeStyle, completedStyle].join(' ')}>
                    {children}
                </div>
                <label className={[styles.label, activeStyle].join(' ')}>{label}</label>
            </div>
        </div>
    )
}