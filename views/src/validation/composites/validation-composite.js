export default class ValidationComposite {
    constructor(validators) {
        this.validators = validators;
    }

    validate(field, value) {
        const validators = this.validators.filter((validator) => validator.field === field)
        for (const v of validators) {
            const error = v.validate(value)
            if (error) {
                return error;
            }
        }
    }
}