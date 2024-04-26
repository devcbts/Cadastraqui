
export default class TextValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const onlyNumberRegExp = /^[a-zA-Z]*$/g
        return onlyNumberRegExp.test(value) ? null : "Apenas texto"
    }
}