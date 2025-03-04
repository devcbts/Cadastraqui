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
                const files = e.target.files
                onUpload(files)
            }}
            accept="application/pdf"
            multiple={multiple}
        />
        <div onClick={() => ref.current.click()} style={{ cursor: 'pointer' }} >
            {children}
        </div>
    </>)

}