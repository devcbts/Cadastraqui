import ValidationBuilder from "../../../validation/builders/validation-builder";
import ValidationComposite from "../../../validation/composites/validation-composite";

const passwordRecoveryValidation = new ValidationComposite([
    ...ValidationBuilder.create("password").min(6).required().build()
])

export default passwordRecoveryValidation