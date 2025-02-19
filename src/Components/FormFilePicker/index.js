import { Controller } from "react-hook-form";
import { NotificationService } from "services/notification";
import FilePickerBase from "../FilePickerBase";

export default function FormFilePicker({ name, show = "all", label, control, accept, multiple = false }) {
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
                        show={show}
                        error={showErrorBorder(isDirty, error)}
                        {...rest}
                        accept={accept}
                        multiple={multiple}
                        onChange={(e) => {
                            const files = e.target.files
                            if (!files.length === 0) {
                                return
                            }

                            for (const item of files) {
                                if (item.size >= 10 * 1024 * 1024) {
                                    NotificationService.error({ text: 'Arquivo deve ser menor que 10MB' })
                                    return
                                }
                            }
                            field.onChange(multiple ? e.target.files : e.target.files[0])
                        }}
                    />
                )
            }}
        />
    )
}