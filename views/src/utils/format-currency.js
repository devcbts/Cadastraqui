export function formatCurrency(value) {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return '';
    return numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}