import validateEmail from "../../utils/validate-email"

export default class EmailValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const isValidEmail = validateEmail(value)

        return isValidEmail ? null : 'Email inválido'
    }
}