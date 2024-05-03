import styles from './styles.module.scss'
import check from '../../Assets/icons/check.svg'
export default function InputBase({
    label,
    error,
    ...props

}) {
    const borderStyle = error ? styles.error : styles.pass
    return (
        <div className={styles.container}>
            <div className={styles.inputwrapper}>
                <label className={styles.label} >{label}</label>
                <input className={[styles.input, borderStyle].join(' ')} {...props} />
                {!error && <img className={styles.icon} src={check}></img>}
            </div>

            {error &&
                <label className={styles.error}>
                    {error}
                </label>
            }
        </div>
    )
}