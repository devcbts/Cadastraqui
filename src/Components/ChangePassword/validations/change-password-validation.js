import ValidationBuilder from "../../../validation/builders/validation-builder"
import ValidationComposite from "../../../validation/composites/validation-composite"

const changePasswordValidation = new ValidationComposite([
    ...ValidationBuilder.create("oldPass").required().min(6).build(),
    ...ValidationBuilder.create("newPass").required().min(6).build(),
])

export default changePasswordValidation