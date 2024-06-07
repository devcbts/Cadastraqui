import styles from './styles.module.scss'
const { Controller } = require("react-hook-form");
export default function ExpenseInput({ control, name }) {
    const getBorder = (isDirty, error) => {
        if ((!isDirty && error) || (isDirty && error)) {
            return styles.error
        }
        return ''
    }
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { isDirty, error } }) => {
                return (
                    <input
                        className={[styles.container, getBorder(isDirty, error)].join(' ')}
                        {...field}
                    >
                    </input>
                )
            }}
        >

        </Controller>
    )
}