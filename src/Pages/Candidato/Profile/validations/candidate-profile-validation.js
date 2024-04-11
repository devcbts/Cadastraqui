import ValidationBuilder from "../../../../validation/builders/validation-builder"
import ValidationComposite from "../../../../validation/composites/validation-composite"

const candidateProfileValidation = (info) => new ValidationComposite([
    ...ValidationBuilder.create("name").required().build(),
    ...ValidationBuilder.create("phone").phone().required().build(),
    ...ValidationBuilder.create("email").required().email().build(),
    ...ValidationBuilder.create("CEP").required().build(),
    ...ValidationBuilder.create("address").required().build(),
    ...ValidationBuilder.create("addressNumber").required().build(),
    ...ValidationBuilder.create("neighborhood").required().build(),
    ...ValidationBuilder.create("city").required().build(),
    ...ValidationBuilder.create("UF").required().build(),
    ...ValidationBuilder.create("CPF").cpf().required().build(),

])

export default candidateProfileValidation