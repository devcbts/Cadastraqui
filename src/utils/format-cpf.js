export function formatCPF(cpf) {
    if (!cpf) {
        return ""
    }
    const digits = cpf
        ?.replace(/\D/g, '')
    if (digits.length < 11) return cpf
    return cpf
        // Remove caracteres não numéricos
        ?.replace(/\D/g, '')
        // Insere um ponto após o terceiro e o sexto dígito
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        // Insere um hífen após o nono dígito
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        // Impede a entrada de mais de 11 dígitos
        .replace(/(-\d{2})\d+?$/, '$1');

}