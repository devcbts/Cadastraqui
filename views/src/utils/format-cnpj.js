export function formatCNPJ(cnpj) {
    return cnpj
        // Remove caracteres não numéricos
        .replace(/\D/g, '')
        // Insere ponto após o segundo e quinto dígito
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        // Insere barra após o oitavo dígito
        .replace(/(\d{3})(\d)/, '$1/$2')
        // Insere hífen após o décimo segundo dígito
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        // Impede a entrada de mais de 14 dígitos
        .replace(/(-\d{2})\d+?$/, '$1');
}