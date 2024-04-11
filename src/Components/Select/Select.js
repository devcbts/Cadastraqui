import styles from './styles.module.css'
export default function Select({ name, label, options, error, ...props }) {
    return (
        <fieldset className={styles.container}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <select
                className={styles.select}
                data-error={error?.[name] === null ? "null" : !!error?.[name]}
                id={name}
                name={name}
                {...props}
            >
                {
                    options.map((option) => (
                        <option
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))
                }

            </select>
            <div className={styles.errorWrapper}>
                {(error && !!error[name]) && <label className={styles.error}>{error[name]}</label>}
            </div>
        </fieldset>
    )
}