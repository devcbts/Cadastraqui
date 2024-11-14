import { forwardRef, useRef } from "react";
import InputBase from "../InputBase";
import styles from './styles.module.scss'
const FilePickerBase = forwardRef(({ label, error, show, ...props }, ref) => {
    const inputRef = useRef(null)
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="file" hidden ref={inputRef} {...props} />
            <InputBase
                label={label}
                error={error}
                ref={ref}
                show={show}
                onClick={() => inputRef.current.click()}
                value={'Anexar arquivo'}
                readOnly
                data-type="file"
            />
            <h6 className={styles.aviso}>*Tamanho máximo de 10Mb</h6>
        </div>
    )
})

export default FilePickerBase