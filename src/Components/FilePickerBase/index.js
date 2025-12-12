import { ReactComponent as Upload } from 'Assets/icons/upload.svg';
import InputContainer from "Components/InputBase/InputContainer";
import { forwardRef, useRef } from "react";
import styles from './styles.module.scss';
const FilePickerBase = forwardRef(({ label, error, show, tooltip, ...props }, ref) => {
    const inputRef = useRef(null)
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InputContainer
                label={label}
                show={show}
                error={error}
                tooltip={tooltip}
            >
                {(id) => {
                    return (
                        <>
                            <input type="file"
                                style={{ display: 'none' }}
                                {...props}
                                ref={inputRef}
                                id={id} />
                            <div
                                style={{ cursor: 'pointer', width: "100%", height: '100%', display: 'flex', alignItems: 'center', alignContent: 'end', padding: '4px 8px', flexGrow: '1', }}
                                onClick={() => inputRef.current?.click()}>
                                <span style={{ color: '#52525C', flexGrow: '1' }}>Anexar arquivo</span>
                                <Upload height={'100%'}
                                    stroke='black'
                                    strokeWidth={.3} />
                            </div>
                        </>
                    )
                }}

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