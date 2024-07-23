import { useEffect, useState } from "react";
import { StepContext } from "../context";
import styles from './styles.module.scss'
export function FormStepperRoot({ activeStep, vertical = false, children }) {
    // used as key to ensure component will re-render (reload) even if user clicks on current activeStep
    const [reload, setReload] = useState(1)
    const handleReload = () => {
        setReload((prev) => prev + 1)
    }
    return (
        <StepContext.Provider key={reload} value={{ activeStep, vertical, reload: handleReload }}>
            <div className={[styles.container, vertical ? styles.vertical : ''].join(' ')}>
                {children}
            </div>
        </StepContext.Provider>
    )
}