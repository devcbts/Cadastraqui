import styles from './styles.module.css'
/**
 * 
 * @param {*} name Used to 'link' label to it's current input and find field on error object
 * @param {*} label Used to show what's the input for
 * @param {*} error Object that contains the field that reffers to "name" param
 * @returns 
 */
export default function Input({ name, label, error, ...props }) {
    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={name}>
                {label}
            </label>
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    data-error={error?.[name] === null ? "null" : !!error?.[name]}
                    id={name}
                    name={name}
                    {...props}
                ></input>
                <div className={styles.errorWrapper}>
                    {(error && !!error[name]) && <label className={styles.error}>{error[name]}</label>}
                </div>
            </div>
        </div>
    )
}