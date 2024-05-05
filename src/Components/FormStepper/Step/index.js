import { useContext } from 'react'
import styles from './styles.module.scss'
import { StepContext } from '../context'
export function FormStep({ index, label = '', children }) {
    const { activeStep } = useContext(StepContext)
    const activeStyle = activeStep === index ? styles.active : ''
    const completedStyle = activeStep > index ? styles.completed : ''
    console.log('step', activeStep)
    return (
        <div className={styles.step}>
            <div className={styles.contentwrapper}>
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