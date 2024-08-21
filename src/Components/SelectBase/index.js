import { forwardRef, useId } from "react";
import ReactSelect from "react-select";
import check from '../../Assets/icons/check.svg';
import errorx from '../../Assets/icons/error.svg';
import inputBaseStyles from '../InputBase/styles.module.scss';

const SelectBase = forwardRef(({ label, error, ...props }, ref) => {
    const id = useId()
    const borderStyle = error === null ? '#CFCFCF' : (error ? "#EF3E36" : "#499468")
    const paddingStyle = error !== null
    return (
        <div className={inputBaseStyles.container}>
            <div className={inputBaseStyles.inputwrapper}>
                <label className={inputBaseStyles.label} htmlFor={`${id}-${label}`} >{label}</label>
                <div className={inputBaseStyles.inputbox}>
                    <ReactSelect
                        inputId={`${id}-${label}`}
                        noOptionsMessage={() => 'Nenhuma opção'}
                        ref={ref}
                        placeholder="Selecione"
                        isMulti={props.multiple}
                        styles={{
                            container: (style) => ({ ...style, outline: "none", paddingRight: "-2px" }),
                            control: (style) => ({ ...style, border: `1px solid ${borderStyle}`, outline: "none", borderRadius: "8px", paddingRight: paddingStyle ? '28px' : '0' }),
                        }}
                        {...props}
                    />
                    {(borderStyle === "#499468") && <img className={inputBaseStyles.icon} src={check} alt="inputSelect"></img>}
                    {(borderStyle === "#EF3E36") && <img className={inputBaseStyles.icon} src={errorx} alt="inputSelectError"></img>}
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