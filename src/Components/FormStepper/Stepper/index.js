import { useContext } from 'react'
import { StepContext } from '../context'
import styles from './styles.module.scss'
export function StepperContainer({ children }) {
    const { vertical } = useContext(StepContext)
    const verticalStyles = vertical ? styles.vertical : ''
    return (
        <div className={[styles.containerVertical, verticalStyles].join(' ')}>
            {children}
        </div>
    )
}