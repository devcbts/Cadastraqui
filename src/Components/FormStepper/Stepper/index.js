import { Children, useContext } from 'react'
import styles from './styles.module.scss'
import { StepContext } from '../context'
export function StepperContainer({ children }) {
    const { vertical } = useContext(StepContext)
    const verticalStyles = vertical ? styles.vertical : ''
    console.log('vertical', vertical, children)
    return (
        <div className={[styles.container, verticalStyles].join(' ')}>
            {children}
        </div>
    )
}