import InputForm from "Components/InputForm";

export default function MoneyFormInput({ label, name, control, ...props }) {
    const transformToCurrency = (value = '') => {
        let valueToParse = value;
        if (!value) {
            valueToParse = 0
        }

        if (!valueToParse?.toString().includes('.') && !valueToParse?.toString().includes(',')) {
            valueToParse = Number(value) * 100;
        }
        let parsedValue = parseFloat(valueToParse?.toString().replaceAll('.', '').replace(',', '.').replace(/[^\d-]/g, ''))
        // return the current value if it does not end with ,00 (1230,00), because when formatted it will display a diff value
        parsedValue = parsedValue.toString().endsWith(',00') ? parsedValue : parsedValue / 100
        return Number(parsedValue).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }
    return (
        <InputForm
            label={label}
            name={name}
            control={control}
            {...props}
            transform={(e) => {
                return transformToCurrency(e.target.value)
            }}
        />
    )
}