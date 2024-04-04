import MinLengthValidator from "../validators/min-length-validator";
import RequiredFieldValidation from "../validators/required-field-validator";
import CPFValidator from "../validators/cpf-validator";
import EmailValidator from "../validators/email-validator";
import CnpjValidator from "../validators/cnpj-validator";
import PhoneValidator from "../validators/phone-validator";

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

    cpf() {
        this.validators.push(new CPFValidator(this.field))
        return this;
    }
    email() {
        this.validators.push(new EmailValidator(this.field))
        return this;
    }

    cnpj() {
        this.validators.push(new CnpjValidator(this.field))
        return this;
    }

    phone() {
        this.validators.push(new PhoneValidator(this.field))
        return this;
    }
    build() {
        return this.validators
    }
}