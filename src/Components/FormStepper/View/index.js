import { StepContext } from "../context"

export function StepView({ index, children }) {

    return (
        <StepContext.Consumer >
            {({ activeStep }) => {
                return activeStep !== index ? null : children
            }}
        </StepContext.Consumer>
    )
}