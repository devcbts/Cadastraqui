export function toFloat(value) {
    if (!value) {
        return 0
    }
    let parsedValue = parseFloat(value?.toString().replaceAll('.', '').replace(',', '.').replace(/[^\d-]/g, ''))
    // return the current value if it does not end with ,00 (1230,00), because when formatted it will display a diff value
    return parsedValue.toString().endsWith(',00') ? parsedValue : parsedValue / 100
}
