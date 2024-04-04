import ValidationBuilder from "../../../validation/builders/validation-builder";
import ValidationComposite from "../../../validation/composites/validation-composite";

const entityInfoValidation = new ValidationComposite([
    ...ValidationBuilder.create("name").required().build(),
    ...ValidationBuilder.create("email").required().email().build(),
    ...ValidationBuilder.create("password").required().min(6).build(),
    ...ValidationBuilder.create("role").required().build(),
    ...ValidationBuilder.create("CNPJ").required().build(),
    ...ValidationBuilder.create("logo").required().build(),
    ...ValidationBuilder.create("socialReason").required().build(),
    ...ValidationBuilder.create("CEP").required().build(),
    ...ValidationBuilder.create("address").required().build(),
    ...ValidationBuilder.create("addressNumber").required().build(),
    ...ValidationBuilder.create("neighborhood").required().build(),
    ...ValidationBuilder.create("city").required().build(),
    ...ValidationBuilder.create("educationalInstitutionCode").required().build()

])

export default entityInfoValidation