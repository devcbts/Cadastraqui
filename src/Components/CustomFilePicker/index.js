import { useRef } from "react";
export default function CustomFilePicker({
    onUpload,
    multiple = false,
    children,
}) {
    const ref = useRef(null)
    return (<>
        <input
            hidden
            ref={ref}
            type="file"

            onChange={(e) => {
                e.preventDefault()
                const files = e.target.files
                onUpload(files)
            }}
            accept="application/pdf"
            multiple={multiple}
        />
        <div onClick={(e) => {
            e.stopPropagation()
            console.log(e.isPropagationStopped())
            ref.current.click()
        }} style={{ cursor: 'pointer' }} >
            {children}
        </div>
    </>)

}