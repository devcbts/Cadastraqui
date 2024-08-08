import InputForm from "Components/InputForm";
import moneyInputMask from "./money-input-mask";
import { Controller } from "react-hook-form";
import InputBase from "Components/InputBase";

export default function MoneyFormInput({ label, name, control, ...props }) {
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
                return <InputBase
                    label={label}
                    name={name}
                    control={control}
                    {...field}
                    {...props}
                    error={showErrorBorder(isDirty, error)}
                    value={!field.value ? moneyInputMask(0) : moneyInputMask(field.value)}
                    transform={(e) => {
                        return moneyInputMask(e.target.value)
                    }}
                />
            }}
        >


        </Controller>
    )
}