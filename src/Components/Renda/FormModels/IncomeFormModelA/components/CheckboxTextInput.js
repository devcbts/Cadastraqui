import FormCheckbox from "../../../../Inputs/FormCheckbox"
import Input from "../../../../Inputs/FormInput"

export default function CheckboxTextInput({ label, checkname, inputname, error, checkregister, inputregister, conditionToShow = true }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: conditionToShow ? '1fr 1fr' : '1fr' }}>
            <FormCheckbox
                {...checkregister}
                label={label}
                name={checkname}
            />
            {
                conditionToShow &&
                <Input
                    {...inputregister}
                    label="Informe o valor"
                    name={inputname}
                    error={error}
                />}
        </div>
    )
}