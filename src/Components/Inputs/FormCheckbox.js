import { forwardRef } from "react"

const FormCheckbox = forwardRef(({ name, label, ...props }, ref) => {
    return (
        <div class="survey-box">
            <label id={`${name}-label`}>
                {label}
            </label>
            <br />
            <p className="onoff">

                <input
                    type="checkbox"
                    name={name}
                    id={name}
                    class="survey-control"
                    ref={ref}
                    {...props}

                />
                <label htmlFor={name} id="yesno"></label>

            </p>
        </div>
    )
})
export default FormCheckbox