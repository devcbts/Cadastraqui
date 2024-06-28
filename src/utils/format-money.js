export default function formatMoney(value) {
    const valueAsNum = Number(value?.toString())
    let result = 0;
    if (!isNaN(valueAsNum)) {
        result = valueAsNum
    }
    return Number(result).toLocaleString('pt-br', { style: "currency", currency: "brl" })
}