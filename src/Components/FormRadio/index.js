import { useRef, useState } from "react";
import { Controller } from "react-hook-form";


export default function FormRadio({ name, control, label, value, color }) {
    // const showErrorBorder = (isDirty, error) => {
    //     // Input wasn't modified but has error OR has been modified and has error (ERROR BORDER)
    //     if ((!isDirty && error) || (isDirty && error)) {
    //         return error?.message
    //     }
    //     // Input wasn't modified (NO BORDER)
    //     if (!isDirty) {
    //         return null
    //     }
    //     // Input was changed but there's no error (SUCCESS BORDER)
    //     if (!error && isDirty) {
    //         return ''
    //     }
    // }
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { isDirty, error } }) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '2px', alignItems: 'center', color: color ? "#52525C" : "white", textTransform: "capitalize" }}>

                        <input
                            {...field}
                            onChange={(e) => {
                                field.onChange(e.target.value)
                            }}
                            value={value}
                            type="radio"
                            checked={field.value === value}
                            style={{ accentColor: '#1F4B73' }}
                            id={value}
                        />
                        <label htmlFor={value} style={{ fontWeight: "600" }}>{label}</label>
                    </div>
                )
            }}
        />
    )
}