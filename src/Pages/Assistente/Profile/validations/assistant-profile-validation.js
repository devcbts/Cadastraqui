import ValidationBuilder from "../../../../validation/builders/validation-builder"
import ValidationComposite from "../../../../validation/composites/validation-composite"

const assistantProfileValidation = new ValidationComposite([
    ...ValidationBuilder.create("name").required().build(),
    ...ValidationBuilder.create("phone").phone().required().build(),
    ...ValidationBuilder.create("email").required().email().build(),
    ...ValidationBuilder.create("CRESS").required().build(),
    ...ValidationBuilder.create("CPF").cpf().required().build(),

])

export default assistantProfileValidation