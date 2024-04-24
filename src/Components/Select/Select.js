import { forwardRef } from 'react'
import styles from './styles.module.css'
const Select = forwardRef(({ name, label, options, error, ...props }, ref) => {
    const useReactHookForm = error?.[name]?.hasOwnProperty("message") ? error?.[name]?.message : error?.[name]
    const style = error === null ? "null" : !!useReactHookForm
    return (
        <fieldset className={styles.container}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <select
                className={styles.select}
                data-error={style}
                id={name}
                name={name}
                defaultValue={null}
                {...props}
                ref={ref}
            >
                {
                    options?.map((option) => (
                        <option
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))
                }

            </select>
            {/* <div className={styles.errorWrapper}>
                {(error && !!error[name]) && <label className={styles.error}>{error[name]}</label>}
            </div> */}
        </fieldset>
    )
})
export default Select