import { isValidCPF } from "../../utils/validate-cpf"

export default class CPFValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const isValid = isValidCPF(value)
        return isValid ? null : 'CPF inválido'
    }
}