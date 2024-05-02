
export default class TextValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const onlyNumberRegExp = /^\D*$/g
        return onlyNumberRegExp.test(value) ? null : "Apenas texto"
    }
}