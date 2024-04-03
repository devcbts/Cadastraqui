import ValidationComposite from "../../../validation/composites/validation-composite";
import ValidationBuilder from "../../../validation/builders/validation-builder";

const loginInfoValidation = new ValidationComposite(
    [
        ...ValidationBuilder.create('email').required().email().build(),
        ...ValidationBuilder.create('password').required().build(),
    ]
)

export default loginInfoValidation