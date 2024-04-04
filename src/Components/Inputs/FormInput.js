import React from "react";
export default function Input({ fieldName, label, error, ...props }) {
    return (
        <div class="survey-box" >
            <label for={fieldName} id={`${fieldName}-label`}>
                {label}
            </label>
            <br />
            <input
                data-error={error && !!error[fieldName]}
                className="survey-control"
                name={fieldName}
                id={fieldName}
                {...props}
            />
            {(error && !!error[fieldName]) &&
                <label style={{ fontSize: 12 }}>{error[fieldName]}</label>}
        </div>
    )
}