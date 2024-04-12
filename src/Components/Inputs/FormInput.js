import React from "react";
export default function Input({ fieldName, name, label, error, ...props }) {
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
                {...props}
            />
            {(error && !!error[fieldName ?? name]) &&
                <label style={{ fontSize: 12, color: "#ef3e36" }}>{error[fieldName ?? name]}</label>}
        </div>
    )
}