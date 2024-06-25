export default function validateCEP(cep = '') {
    console.log('cep', cep)
    const onlyDigitsCep = cep?.replace(/\D/g, '')
    return onlyDigitsCep.length === 8;
}