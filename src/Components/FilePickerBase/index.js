import { forwardRef, useRef } from "react";
import InputBase from "../InputBase";
import styles from './styles.module.scss'
import InputContainer from "Components/InputBase/InputContainer";
import { ReactComponent as Upload } from 'Assets/icons/upload.svg'
const FilePickerBase = forwardRef(({ label, error, show, ...props }, ref) => {
    const inputRef = useRef(null)
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="file" hidden ref={inputRef} {...props} />
            <InputContainer
                label={label}
                show={show}
            >
                <div style={{ cursor: 'pointer', width: "100%", height: '100%', display: 'flex', alignItems: 'center', alignContent: 'end', padding: '4px 8px', }} onClick={() => inputRef.current?.click()}>
                    <span style={{ color: '#52525C', flexGrow: '1' }}>Anexar arquivo</span>
                    <Upload height={'100%'} />
                </div>
            </InputContainer>
            {/* <InputBase
                label={label}
                error={error}
                ref={ref}
                show={show}
                onClick={() => inputRef.current.click()}
                value={'Anexar arquivo'}
                readOnly
                data-type="file"
                style={{ cursor: 'pointer' }}
            /> */}
            <h6 className={styles.aviso}>*Tamanho máximo de 10Mb</h6>
        </div>
    )
})

export default FilePickerBase