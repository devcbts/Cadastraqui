import React, { forwardRef } from "react";
const Input = forwardRef(({ fieldName, name, label, error, ...props }, ref) => {
    return (
        <div class="survey-box" >
            <label htmlFor={fieldName ?? name} id={`${fieldName ?? name}-label`}>
                {label}
            </label>
            <br />
            <input
                data-error={error && !!error[fieldName ?? name]}
                className="survey-control"
                name={fieldName ?? name}
                id={fieldName ?? name}
                ref={ref}
                {...props}
            />
            {(error && !!error[fieldName ?? name]) &&
                <label style={{ fontSize: 12, color: "#ef3e36" }}>{error[fieldName ?? name]}</label>}
        </div>
    )
})

export default Input