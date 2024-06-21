import { useRef, useState } from "react";
import { Controller } from "react-hook-form";


export default function FormRadio({ name, control, label, value }) {
    const showErrorBorder = (isDirty, error) => {
        // Input wasn't modified but has error OR has been modified and has error (ERROR BORDER)
        if ((!isDirty && error) || (isDirty && error)) {
            return error?.message
        }
        // Input wasn't modified (NO BORDER)
        if (!isDirty) {
            return null
        }
        // Input was changed but there's no error (SUCCESS BORDER)
        if (!error && isDirty) {
            return ''
        }
    }
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { isDirty, error } }) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', color: "white", textTransform: "capitalize" }}>

                        <input
                            {...field}
                            onChange={(e) => {
                                field.onChange(e.target.value)
                                console.log(e.target.value)
                            }}
                            value={value}
                            type="radio"
                        />
                        <span>{label}</span>
                    </div>
                )
            }}
        />
    )
}