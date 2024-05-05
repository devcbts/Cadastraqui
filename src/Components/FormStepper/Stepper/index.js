import styles from './styles.module.scss'
import { StepContext } from '../context'
export function StepperContainer({ children }) {

    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}