import { Controller } from 'react-hook-form';
import styles from './styles.module.scss'
import moneyInputMask from 'Components/MoneyFormInput/money-input-mask';
export default function ExpenseMoneyInput({ name, control, }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) =>
                <input
                    className={styles.container}
                    {...field}
                    onChange={(e) => {
                        field.onChange(moneyInputMask(e.target.value))
                    }}
                >
                </input>
            }
        >

        </Controller>

    )
}

