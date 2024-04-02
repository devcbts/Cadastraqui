export default class RequiredFieldValidation {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const hasValue = !!value
        return hasValue ? null : 'Campo obrigatório'
    }
}