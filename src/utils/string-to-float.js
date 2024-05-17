const stringToFloat = (str = '') => {
    const digits = str.replace(/[^\d,]/g, '').replace(',', '.')
    const floatingValue = parseFloat(digits)
    if (isNaN(floatingValue)) {
        return 0
    }
    return floatingValue
}

export default stringToFloat