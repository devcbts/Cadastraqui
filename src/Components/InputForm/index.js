import { useController } from "react-hook-form";
import InputBase from "../InputBase";
import { isDirty } from "zod";
import { useEffect } from "react";

export default function InputForm({ name, label, control, transform = (e) => e, ...props }) {
    const { field,
        fieldState: {
            error,
            isDirty
        } } = useController({
            control,
            name: name
        })

    const showErrorBorder = () => {
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
        <InputBase
            label={label}
            error={showErrorBorder()}
            {...field}
            onChange={(e) => field.onChange(transform(e))}
            {...props}
        />
    )
} 