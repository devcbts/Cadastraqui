export default function validateCnpj(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length != 14)
        return false;

    let tamanhoTotal: number = cnpj.length - 2
    let cnpjSemDigitos: string = cnpj.substring(0, tamanhoTotal);
    let digitosVerificadores = cnpj.substring(tamanhoTotal);
    let soma: number = 0;
    let pos: number = tamanhoTotal - 7;
    let resultado: number;
    for (let i = tamanhoTotal; i >= 1; i--) {
        soma += parseInt(cnpjSemDigitos.charAt(tamanhoTotal - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseInt(digitosVerificadores.charAt(0)))
        return false;

    tamanhoTotal = tamanhoTotal + 1;
    cnpjSemDigitos = cnpj.substring(0, tamanhoTotal);
    soma = 0;
    pos = tamanhoTotal - 7;
    for (let i = tamanhoTotal; i >= 1; i--) {
        soma += parseInt(cnpjSemDigitos.charAt(tamanhoTotal - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseInt(digitosVerificadores.charAt(1)))
        return false;

    return true;
}

