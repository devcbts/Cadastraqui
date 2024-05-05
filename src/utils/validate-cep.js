export default function validateCEP(cep = '') {
    console.log('erro aqui')
    const onlyDigitsCep = cep?.replace(/\D/g, '')
    return onlyDigitsCep.length === 8;
}