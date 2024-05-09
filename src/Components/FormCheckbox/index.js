import { Controller } from "react-hook-form";
import CheckboxBase from "../CheckboxBase";

export default function FormCheckbox({ name, control, label }) {
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
                    <CheckboxBase
                        label={label}
                        {...field}

                        error={showErrorBorder(isDirty, error)}
                        onChange={(e) => {
                            field.onChange(e.target.value === "true")
                        }}
                    />
                )
            }}
        />
    )
}