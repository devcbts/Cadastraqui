import { forwardRef } from "react";
import styles from './styles.module.scss'
const CheckboxBase = forwardRef(({ label, error, value, ...props }, ref) => {
    const checkedStyles = props.value ? styles.checked : ''
    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>
            <div className={styles.row}>
                <label className={[styles.option, styles.label].join(' ')}>
                    <input
                        className={styles.radio}
                        type="radio"
                        {...props}
                        value={true}
                        checked={value?.toString() === "true"}
                        ref={ref}
                    /> Sim
                </label>
                <label className={[styles.option, styles.label].join(' ')}>
                    <input
                        className={styles.radio}
                        type="radio"
                        {...props}
                        value={false}
                        checked={value?.toString() === "false"}
                        ref={ref}
                    />Não
                </label>
            </div>
            <div className={styles.errorwrapper}>

                {error &&
                    <label className={styles.error}>
                        Marque uma opção
                    </label>
                }
            </div>
            {/* <div className={styles.row}>
                Não
                <div className={[styles.wrapper, checkedStyles].join(' ')} role="checkbox" onClick={props.onChange}>
                    <div className={styles.toggle}></div>
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        ref={ref}
                        {...props}
                    />
                </div>
                Sim
            </div> */}

        </div>
    )
})

export default CheckboxBase