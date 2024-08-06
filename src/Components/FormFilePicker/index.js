import { Controller } from "react-hook-form";
import FilePickerBase from "../FilePickerBase";
import { NotificationService } from "services/notification";

export default function FormFilePicker({ name, label, control, accept }) {
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
            render={({ field, fieldState: { error, isDirty } }) => {
                const { value, ...rest } = field
                return (
                    <FilePickerBase
                        label={label}
                        error={showErrorBorder(isDirty, error)}
                        {...rest}
                        accept={accept}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) {
                                return
                            }
                            if (file.size >= 10 * 1024 * 1024) {
                                NotificationService.error({ text: 'Arquivo deve ser menor que 10MB' })
                                return
                            }
                            field.onChange(e.target.files[0])
                        }}
                    />
                )
            }}
        />
    )
}