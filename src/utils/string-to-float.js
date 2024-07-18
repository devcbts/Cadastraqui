const stringToFloat = (str = '') => {
    const ensureString = str?.toString()
    if (!ensureString) return 0
    const digits = ensureString.replace(/[^\d,]/g, '').replace(',', '.')
    const floatingValue = parseFloat(digits)
    if (isNaN(floatingValue)) {
        return 0
    }
    return floatingValue
}

export default stringToFloat