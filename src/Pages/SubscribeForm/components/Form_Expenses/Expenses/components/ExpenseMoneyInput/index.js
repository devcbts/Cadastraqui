import { Controller } from 'react-hook-form';
import styles from './styles.module.scss'
import moneyInputMask from 'Components/MoneyFormInput/money-input-mask';
export default function ExpenseMoneyInput({ name, control, ...props }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) =>
                <input
                    className={styles.container}
                    {...field}
                    value={moneyInputMask(field.value)}
                    onChange={(e) => {
                        field.onChange(moneyInputMask(e.target.value))
                    }}
                    {...props}
                >
                </input>
            }
        >

        </Controller>

    )
}

