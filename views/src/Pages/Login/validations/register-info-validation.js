import ValidationComposite from "../../../validation/composites/validation-composite";
import ValidationBuilder from "../../../validation/builders/validation-builder";

const registerInfoValidation = new ValidationComposite(
    [
        ...ValidationBuilder.create('name').required().build(),
        ...ValidationBuilder.create('CPF').required().build(),
        ...ValidationBuilder.create('birthDate').required().build(),
        ...ValidationBuilder.create('phone').required().build(),
        ...ValidationBuilder.create('CEP').required().build(),
        ...ValidationBuilder.create('UF').required().build(),
        ...ValidationBuilder.create('neighborhood').required().build(),
        ...ValidationBuilder.create('city').required().build(),
        ...ValidationBuilder.create('addressNumber').required().build(),
        ...ValidationBuilder.create('address').required().build(),
    ]
)

export default registerInfoValidation