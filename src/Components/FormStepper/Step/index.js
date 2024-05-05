import { useContext } from 'react'
import styles from './styles.module.scss'
import { StepContext } from '../context'
export function FormStep({ index, label = '', children }) {
    const { activeStep, vertical } = useContext(StepContext)
    const activeStyle = activeStep === index ? styles.active : ''
    const completedStyle = activeStep > index ? styles.completed : ''
    const verticalStyle = vertical ? styles.vertical : ''
    return (
        <div className={styles.step} style={{ marginRight: vertical && 0 }}>
            <div className={[styles.contentwrapper, verticalStyle].join(' ')}>
                <div className={[styles.container, activeStyle, completedStyle].join(' ')}>
                    <div>
                        {children}
                    </div>
                </div>
                <label className={styles.label}>{label}</label>
            </div>
        </div>
    )
}