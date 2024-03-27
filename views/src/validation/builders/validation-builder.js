import RequiredFieldValidation from "../validators/required-field-validator";

export default class ValidationBuilder {
    constructor(field = '', validators = []) {
        this.field = field
        this.validators = validators
    }

    static create(field) {
        return new ValidationBuilder(field, [])
    }

    required() {
        this.validators.push(new RequiredFieldValidation(this.field))
        return this;
    }

    build() {
        return this.validators
    }
}