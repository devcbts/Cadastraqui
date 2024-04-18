import { toFloat } from "./currency-to-float";

export function formatCurrency(value = "") {
    const floatValue = toFloat(value);
    return Number(floatValue).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

}