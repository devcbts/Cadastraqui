export function toFloat(value) {
    if (!value) {
        return 0
    }
    let parsedValue = parseFloat(value?.toString().replace(/[^\d-]/g, ''))
    // return the current value if it does not end with ,00 (1230,00), because when formatted it will display a diff value
    return value?.toString().endsWith(',00') ? parsedValue : parsedValue / 100
}
