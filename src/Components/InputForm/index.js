import { Controller, useController } from "react-hook-form";
import InputBase from "../InputBase";

export default function InputForm({ name, label, control, transform = (e) => e, ...props }) {


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
            defaultValue={'abnc'}
            render={({ field, fieldState: { isDirty, error, invalid } }) => {
                return (
                    <InputBase
                        label={label}
                        error={showErrorBorder(isDirty, error)}
                        {...field}
                        onChange={(e) => field.onChange(transform(e) ?? '')}
                        {...props}
                    />
                )
            }}
        />

    )
} 