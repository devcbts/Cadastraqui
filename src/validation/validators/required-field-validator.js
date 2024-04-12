export default class RequiredFieldValidation {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const hasValue = value !== null && value !== undefined && value !== ''
        console.log('valores', value, value !== undefined)
        return hasValue ? null : 'Campo obrigatório'
    }
}