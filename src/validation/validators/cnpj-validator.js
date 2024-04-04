import validateCnpj from "../../utils/validate-cnpj"

export default class CnpjValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        return validateCnpj(value) ? null : 'CNPJ Inválido'
    }
}