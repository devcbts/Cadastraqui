import { StepContext } from "../context";
import styles from './styles.module.scss'
export function FormStepperRoot({ activeStep, vertical = false, children }) {
    return (
        <StepContext.Provider value={{ activeStep, vertical }}>
            <div className={[styles.container, vertical ? styles.vertical : ''].join(' ')}>
                {children}
            </div>
        </StepContext.Provider>
    )
}