import ValidationBuilder from "../../../validation/builders/validation-builder";
import ValidationComposite from "../../../validation/composites/validation-composite";
import ValidateIf from "../../../validation/utils/ValidateIf";

const candidateInfoValidations = (info) => new ValidationComposite(
    [
        ...ValidationBuilder.create('fullName').required().build(),
        ...ValidationBuilder.create('birthDate').required().build(),
        ...ValidationBuilder.create('gender').required().build(),
        ...ValidationBuilder.create('nationality').required().text().build(),
        ...ValidationBuilder.create('natural_city').required().text().build(),
        ...ValidationBuilder.create('natural_UF').required().build(),
        ...ValidationBuilder.create('CPF').required().cpf().build(),
        ...ValidationBuilder.create('RG').required().build(),
        ...ValidationBuilder.create('rgIssuingAuthority').required().build(),
        ...ValidationBuilder.create('rgIssuingState').required().build(),
        ...ValidationBuilder.create('maritalStatus').required().build(),
        ...ValidationBuilder.create('rgIssuingAuthority').required().build(),
        ...ValidationBuilder.create('skinColor').required().build(),
        ...ValidationBuilder.create('religion').required().build(),
        ...ValidationBuilder.create('educationLevel').required().build(),
        ...ValidationBuilder.create('email').required().email().build(),
        ...ValidationBuilder.create('address').required().build(),
        ...ValidationBuilder.create('city').required().build(),
        ...ValidationBuilder.create('UF').required().build(),
        ...ValidationBuilder.create('CEP').required().build(),
        ...ValidationBuilder.create('neighborhood').required().build(),
        ...ValidationBuilder.create('addressNumber').required().build(),
        ...ValidationBuilder.create('profession').required().build(),
        ...ValidationBuilder.create('addressNumber').required().build(),
        ...ValidationBuilder.create('landlinePhone').required().phone().build(),
        ...ValidationBuilder.create('workPhone').phone().build(),
        ...ValidateIf(info.enrolledGovernmentProgram, ValidationBuilder.create('NIS').required().number().build()),
    ]
)

export default candidateInfoValidations