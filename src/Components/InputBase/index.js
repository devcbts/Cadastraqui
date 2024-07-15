import styles from './styles.module.scss'
import check from '../../Assets/icons/check.svg'
import errorx from '../../Assets/icons/error.svg'
import { forwardRef } from 'react'
import Tooltip from 'Components/Tooltip'
const InputBase = forwardRef(({
    label,
    error,
    tooltip,
    ...props
}, ref) => {
    const borderStyle = error === null ? '' : (error ? styles.error : styles.pass)
    return (
        <div className={styles.container}>
            <div className={styles.inputwrapper}>
                {tooltip ? <Tooltip tooltip={tooltip}>
                    <label className={styles.label} >
                        {label}
                    </label>
                </Tooltip>
                    : <label className={styles.label} >
                        {label}
                    </label>
                }
                <div className={styles.inputbox}>
                    <input className={[styles.input, borderStyle].join(' ')} {...props} ref={ref} />
                    {(borderStyle === styles.pass) && <img className={styles.icon} src={check}></img>}
                    {(borderStyle === styles.error) && <img className={styles.icon} src={errorx}></img>}
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