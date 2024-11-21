import React, { useId } from "react"
import styles from './styles.module.scss'
import { AnimatePresence, motion } from "framer-motion"
import checkIcon from '../../Assets/icons/check.svg'
import errorIcon from '../../Assets/icons/error.svg'
import Tooltip from "Components/Tooltip"
import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
export default function InputContainer({ label, error = null, show = "none", wrapperStyle = null, tooltip, children, }) {
    const id = useId()
    const showItems = typeof show === "string" ? [show] : show
    const canShow = (arr) => showItems.some(e => arr.includes(e))
    const showIcon = canShow(["all", "icon"]) && error !== null
    const showMessage = canShow(["all", "error"])
    const iconStyle = canShow(["all", "border"]) && (error === null ? '' : [(error ? styles.error : styles.success)])

    return (
        <div className={styles.container}>
            {label && <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                {<label htmlFor={id} className={styles.label}>{label}</label>}
                {tooltip && <Tooltip tooltip={tooltip} Icon={Help} />}
            </div>}
            <div className={[wrapperStyle ?? styles.wrapper, iconStyle].join(' ')}>

                {typeof children === "function"
                    ? children(id)
                    : React.cloneElement(children, {
                        id
                    })}
                <AnimatePresence>
                    {showIcon && <label
                        htmlFor={id}
                        style={{ all: 'unset' }}
                    >
                        <motion.img
                            key={error ? 'error' : 'success'}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={styles.icon}
                            src={!!error ? errorIcon : checkIcon}
                        />
                    </label>}
                </AnimatePresence>

            </div>
            {showMessage && <label className={styles.errorlabel}> {error}</label >}
        </div >
    )
}