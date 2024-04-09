import ValidationBuilder from "../../../../validation/builders/validation-builder"
import ValidationComposite from "../../../../validation/composites/validation-composite"

const entityProfileValidation = new ValidationComposite([
    ...ValidationBuilder.create("name").required().build(),
    ...ValidationBuilder.create("phone").phone().required().build(),
    ...ValidationBuilder.create("email").required().email().build(),
    ...ValidationBuilder.create("CEP").required().build(),
    ...ValidationBuilder.create("address").required().build(),
    ...ValidationBuilder.create("addressNumber").required().build(),
    ...ValidationBuilder.create("neighborhood").required().build(),
    ...ValidationBuilder.create("city").required().build(),
    ...ValidationBuilder.create("UF").required().build(),
    ...ValidationBuilder.create("CNPJ").cnpj().required().build(),

])

export default entityProfileValidation