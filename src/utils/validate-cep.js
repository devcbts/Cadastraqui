export default function validateCEP(cep = '') {

    const onlyDigitsCep = cep?.replace(/\D/g, '')
    return onlyDigitsCep.length === 8;
}