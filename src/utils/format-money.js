export default function formatMoney(value) {
    return Number(value?.toString()).toLocaleString('pt-br', { style: "currency", currency: "brl" })
}