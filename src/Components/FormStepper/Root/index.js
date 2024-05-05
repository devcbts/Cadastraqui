import { StepContext } from "../context";

export function FormStepperRoot({ activeStep, children }) {
    return (
        <StepContext.Provider value={{ activeStep }}>
            {children}
        </StepContext.Provider>
    )
}