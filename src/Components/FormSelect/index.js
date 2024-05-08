import { Controller } from "react-hook-form";
import SelectBase from "../SelectBase";

export default function FormSelect({ name, label, control, options, value }) {


    const showErrorBorder = (error, isDirty) => {
        console.log(error, isDirty)
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
            render={({ field, fieldState: { error, isDirty } }) => (
                <SelectBase
                    label={label}
                    error={showErrorBorder(error, isDirty)}
                    options={options}
                    {...field}
                    value={options.find(e => e.value === value)}
                    onChange={(e) => {
                        field.onChange(e.value)
                    }}
                />
            )}

        />
    )
}