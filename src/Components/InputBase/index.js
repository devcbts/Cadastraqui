import Tooltip from 'Components/Tooltip'
import React, { forwardRef, useId } from 'react'
import check from '../../Assets/icons/check.svg'
import errorx from '../../Assets/icons/error.svg'
import styles from './styles.module.scss'
const InputBase = forwardRef(({
    label,
    error,
    tooltip,
    ...props
}, ref) => {
    const id = useId()
    const borderStyle = error === null ? '' : (error ? styles.error : styles.pass)
    const element = props.type === 'text-area' ? <textarea className={styles.textarea} /> : <input className={styles.input} />
    return (
        <div className={styles.container}>
            <div className={styles.inputwrapper}>
                {tooltip ? <Tooltip tooltip={tooltip}>
                    <label htmlFor={`${id}-${label}`} className={styles.label} >
                        {label}
                    </label>
                </Tooltip>
                    : (label && (
                        <label htmlFor={`${id}-${label}`} className={styles.label} >
                            {label}
                        </label>
                    ))
                }
                <div className={styles.inputbox}>
                    {React.cloneElement(element, {
                        id: `${id}-${label}`,
                        className: [element.props.className, borderStyle].join(' '), ref: ref, ...props
                    })}
                    {
                        element.type === 'input' && <>
                            {(borderStyle === styles.pass) && <img className={styles.icon} src={check}></img>}
                            {(borderStyle === styles.error) && <img className={styles.icon} src={errorx}></img>}
                        </>
                    }
                </div>


            </div>
            <div className={styles.errorwrapper}>

                {error &&
                    <label className={styles.error}>
                        {error}
                    </label>
                }
            </div>
        </div>
    )
})
export default InputBase