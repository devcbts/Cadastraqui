import validatePhone from "../../utils/validate-phone"

export default class PhoneValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        return validatePhone(value) ? null : "Telefone inválido"
    }
}