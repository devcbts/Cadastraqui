import MinLengthValidator from "../validators/min-length-validator";
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

    min(length) {
        this.validators.push(new MinLengthValidator(this.field, length))
        return this;
    }

    build() {
        return this.validators
    }
}