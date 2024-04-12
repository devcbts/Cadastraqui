
export default class RequiredArrayValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        return value.length !== 0 ? null : 'Campo obtigatório'
    }
}