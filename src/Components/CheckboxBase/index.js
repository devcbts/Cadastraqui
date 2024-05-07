import { forwardRef } from "react";
import styles from './styles.module.scss'
const CheckboxBase = forwardRef(({ label, ...props }, ref) => {
    const checkedStyles = props.value ? styles.checked : ''
    return (
        <div className={styles.container}>
            <label>{label}</label>
            <div className={styles.row}>
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
            </div>

        </div>
    )
})

export default CheckboxBase