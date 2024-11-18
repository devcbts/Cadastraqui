import Tooltip from 'Components/Tooltip'
import React, { forwardRef, useCallback, useId } from 'react'

import styles from './styles.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import PasswordInput from './PasswordInput'
import InputContainer from './InputContainer'
const InputBase = forwardRef(({
    label,
    error,
    tooltip,
    show,
    ...props
}, ref) => {
    const id = useId()
    // const iconStyle = error === null ? '' : [(error ? styles.error : styles.success), styles.trailing]
    // const element = props.type === 'text-area' ? <textarea className={styles.textarea} /> : <input className={styles.input} />
    const renderInput = useCallback(() => {
        switch (props.type) {
            case 'password':
                return <PasswordInput
                    ref={ref}
                    id={id}
                    {...props}
                // className={''}
                />
            case 'text-area':
                return <textarea
                    ref={ref}
                    id={id}
                    {...props}
                // className={''}
                />
            default:
                return <input ref={ref}
                    id={id}
                    {...props}
                // className={''}
                />
        }
    }, [props])
    const className = props.type === "text-area" ? styles.textarea : null
    return (
        <InputContainer
            label={label}
            tooltip={tooltip}
            error={error}
            show={props.type === "text-area" ? ["border", "error"] : show}
            wrapperStyle={className}
        >
            {renderInput()}
        </InputContainer>
    )
})
export default InputBase
// <div className={styles.container}>
//     <div className={styles.inputwrapper}>
//         {tooltip ? <Tooltip tooltip={tooltip}>
//             <label htmlFor={`${id}-${label}`} className={styles.label} >
//                 {label}
//             </label>
//         </Tooltip>
//             : (label && (
//                 <label htmlFor={`${id}-${label}`} className={styles.label} >
//                     {label}
//                 </label>
//             ))
//         }
//         <div className={styles.inputbox}>
//             {React.cloneElement(element, {
//                 id: `${id}-${label}`,
//                 className: [element.props.className, borderStyle].join(' '), ref: ref,
//                 style: !showIcon ? { padding: ' 6px 8px 6px 8px' } : {},
//                 ...props

//             })}
//             {
//                 (element.type === 'input' && showIcon) && <>
//                     {(borderStyle === styles.pass) && <img className={styles.icon} src={check}></img>}
//                     {(borderStyle === styles.error) && <img className={styles.icon} src={errorx}></img>}
//                 </>
//             }
//         </div>


//     </div>
//     <div className={styles.errorwrapper}>

//         {error &&
//             <label className={styles.error}>
//                 {error}
//             </label>
//         }
//     </div>
// </div>





