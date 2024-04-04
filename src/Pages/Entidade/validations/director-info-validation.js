import ValidationBuilder from "../../../validation/builders/validation-builder";
import ValidationComposite from "../../../validation/composites/validation-composite";

const directorInfoValidation = new ValidationComposite([
    ...ValidationBuilder.create("name").required().build(),
    ...ValidationBuilder.create("email").required().email().build(),
    ...ValidationBuilder.create("password").required().min(6).build(),
    ...ValidationBuilder.create("CPF").required().cpf().build(),
    ...ValidationBuilder.create("phone").required().phone().build(),
])

export default directorInfoValidation