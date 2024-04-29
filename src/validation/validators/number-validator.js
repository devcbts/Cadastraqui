
export default class NumberValidator {
    constructor(fieldName) {
        this.field = fieldName
    }

    validate(value) {
        const onlyNumberRegExp = /^[0-9]*$/g
        return onlyNumberRegExp.test(value) ? null : "Apenas números"
    }
}