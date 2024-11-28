import { forwardRef } from "react";
import ReactSelect from "react-select";
import InputContainer from "Components/InputBase/InputContainer";
import styles from './styles.module.scss'
const SelectBase = forwardRef(({ label, error, show = "none", search = true, ...props }, ref) => {
    // const id = useId()
    const borderStyle = error === null ? '#CFCFCF' : (error ? "#EF3E36" : "#499468")
    // const paddingStyle = error !== null
    return (
        <InputContainer
            label={label}
            error={error}
            show={show}
            wrapperStyle={(style) => [style, !props.multiple ? styles.wrapper : ''].join(' ')}
        >
            {(id) => (
                <ReactSelect
                    inputId={`${id}-${label}`}
                    noOptionsMessage={() => 'Nenhuma opção'}
                    ref={ref}
                    placeholder="Selecione"
                    isMulti={props.multiple}
                    isSearchable={search}

                    styles={{
                        singleValue: (style) => ({ ...style, color: '#52525C' }),
                        multiValue: (style) => ({ ...style, color: '#52525C' }),
                        option: (style, { isSelected, isFocused }) => ({
                            ...style,
                            backgroundColor: isFocused ? "#cfcfcf" : (
                                isSelected ? "#1F4B73" : ""
                            ),
                            ":hover": {
                                backgroundColor: "#cfcfcf",
                                color: "#1F4B73"
                            }
                        }),
                        valueContainer: (style) => (props.multiple ? {
                            ...style,
                            maxHeight: '60px',
                            overflowY: 'scroll',
                            scrollbarWidth: 'none',

                        } : {
                            ...style, maxHeight: '35px',
                        }),
                        container: (style) => ({ ...style, outline: "none", paddingRight: "-2px", width: '100%' }),
                        menu: (style) => ({ ...style, borderRadius: '12px', overflow: 'hidden' }),
                        control: (style) => ({
                            display: 'flex',
                            flexDirection: 'row',
                            minHeight: '35px',
                            fontSize: '14px',
                            width: '100%',
                            padding: '0',
                            ":focus-visible": {
                                border: `1px solid ${borderStyle}`,
                                outline: "none"
                            }, color: 'red',
                            // ":hover": {
                            // border: `1px solid ${borderStyle}`,
                            // outline: "none"

                            // },

                            ":active": { borderColor: '#1F4B73' },
                            // border: `1px solid ${borderStyle}`,
                            // outline: "none", borderRadius: "8px", paddingRight: paddingStyle ? '28px' : '0'
                        }),
                    }}
                    {...props}
                />)
            }
        </InputContainer>
    )
    {/* {(borderStyle === "#499468") && <img className={inputBaseStyles.icon} src={check} alt="inputSelect"></img>}
                    {(borderStyle === "#EF3E36") && <img className={inputBaseStyles.icon} src={errorx} alt="inputSelectError"></img>} */}
    //         </div>
    //     </div>


    //     <div className={inputBaseStyles.errorwrapper}>
    //         {error &&
    //             <label className={inputBaseStyles.error}>
    //                 {error}
    //             </label>
    //         }
    //     </div>
    // </div>

    // )
})

export default SelectBase