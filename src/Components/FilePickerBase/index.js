import { forwardRef, useRef } from "react";
import InputBase from "../InputBase";

const FilePickerBase = forwardRef(({ label, error, ...props }, ref) => {
    const inputRef = useRef(null)
    return (
        <>
            <input type="file" hidden ref={inputRef} {...props} />
            <InputBase
                label={label}
                error={error}
                ref={ref}
                onClick={() => inputRef.current.click()}
                value={'Anexar arquivo'}
                readOnly
                data-type="file"
            />
        </>
    )
})

export default FilePickerBase