export default function toPersistence(source, values) {
    return {
        incomeSource: source,
        quantity: values.length,
        incomes: values.map((obj) => ({
            ...Object.keys(obj).reduce((acc, key) =>
            ({
                ...acc, [key]: parseFloat(obj[key].toString()
                    .replace('.', '')
                    .replace(',', '.'))
            }), {})
            , month: obj.month, year: obj.year
        }))
    }
}