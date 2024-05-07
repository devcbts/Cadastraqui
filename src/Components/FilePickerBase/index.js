import { forwardRef } from "react";
import InputBase from "../InputBase";

const FilePickerBase = forwardRef(({ label, error, ...props }, ref) => {
    return (
        <InputBase
            type="file"
            label={label}
            error={error}
            ref={ref}
            {...props}
        />
    )
})

export default FilePickerBase