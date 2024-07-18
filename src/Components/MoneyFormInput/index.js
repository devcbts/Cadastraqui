import InputForm from "Components/InputForm";
import moneyInputMask from "./money-input-mask";

export default function MoneyFormInput({ label, name, control, ...props }) {
    return (
        <InputForm
            label={label}
            name={name}
            control={control}
            {...props}
            transform={(e) => {
                return moneyInputMask(e.target.value)
            }}
        />
    )
}