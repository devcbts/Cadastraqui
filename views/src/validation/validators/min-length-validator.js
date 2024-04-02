export default class MinLengthValidator {
    constructor(fieldName, length) {
        this.field = fieldName
        this.minLength = length
    }

    validate(value) {
        const hasMinLength = value.length >= this.minLength;
        return hasMinLength ? null : `Campo deve ter no mínimo ${this.minLength} caracteres`
    }
}