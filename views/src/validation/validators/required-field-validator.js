export default class RequiredFieldValidation {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        console.log(value)
        const hasValue = !!value
        return hasValue ? null : 'Campo obrigatório'
    }
}