import ReactSelect from "react-select";
import inputBaseStyles from '../InputBase/styles.module.scss'
import styles from './styles.module.scss'
import check from '../../Assets/icons/check.svg'
import errorx from '../../Assets/icons/error.svg'
import { forwardRef } from "react";

const SelectBase = forwardRef(({ label, error, ...props }, ref) => {
    const borderStyle = error === null ? '#CFCFCF' : (error ? "#EF3E36" : "#499468")
    console.log(props.value)
    return (
        <div className={inputBaseStyles.container}>
            <div className={inputBaseStyles.inputwrapper}>
                <label className={inputBaseStyles.label} >{label}</label>
                <div className={inputBaseStyles.inputbox}>
                    <ReactSelect
                        ref={ref}
                        styles={{
                            container: (style) => ({ ...style, outline: "none", width: "calc(100% + 48px)", paddingRight: "-2px" }),
                            control: (style) => ({ ...style, border: `2px solid ${borderStyle}`, outline: "none", borderRadius: "8px", paddingRight: "28px" }),
                        }}
                        {...props}
                    />
                    {(borderStyle === "#499468") && <img className={inputBaseStyles.icon} src={check}></img>}
                    {(borderStyle === "#EF3E36") && <img className={inputBaseStyles.icon} src={errorx}></img>}
                </div>
            </div>


            <div className={inputBaseStyles.errorwrapper}>
                {error &&
                    <label className={inputBaseStyles.error}>
                        {error}
                    </label>
                }
            </div>
        </div>

    )
})

export default SelectBase