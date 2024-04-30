export function toFloat(value) {
    let valueToParse = value;
    if (!value) {
        return 0
    }

    if (!valueToParse?.toString().includes('.') && !valueToParse?.toString().includes(',')) {
        valueToParse = Number(value) * 100;
    }
    let parsedValue = parseFloat(valueToParse?.toString().replaceAll('.', '').replace(',', '.').replace(/[^\d-]/g, ''))
    // return the current value if it does not end with ,00 (1230,00), because when formatted it will display a diff value
    return parsedValue.toString().endsWith(',00') ? parsedValue : parsedValue / 100
}
