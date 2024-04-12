import RequiredArrayValidator from "../validators/required-array-validator"

export default class ArrayValidationBuilder {
    constructor(field = '', validators = []) {
        this.field = field
        this.validators = validators
    }
    static create(field) {
        return new ArrayValidationBuilder(field, [])
    }
    required() {
        this.validators.push(new RequiredArrayValidator(this.field))
        return this
    }
    build() {
        return this.validators
    }
}