import ArrayValidationBuilder from "../../../validation/builders/array-validation-builder";
import ValidationBuilder from "../../../validation/builders/validation-builder";
import ValidationComposite from "../../../validation/composites/validation-composite";
import ValidateIf from "../../../validation/utils/ValidateIf";

const familyMemberInfoValidation = (currentData) => new ValidationComposite([
    ...ValidationBuilder.create("relationship").required().build(),
    ...ValidateIf(currentData.relationship === "Other", ValidationBuilder.create("otherRelationship").required().build()),
    ...ValidationBuilder.create("fullName").required().build(),
    ...ValidationBuilder.create("birthDate").required().build(),
    ...ValidationBuilder.create("gender").required().build(),
    ...ValidationBuilder.create("nationality").required().text().build(),
    ...ValidationBuilder.create("natural_city").required().text().build(),
    ...ValidationBuilder.create("natural_UF").required().build(),
    ...ValidationBuilder.create("CPF").required().cpf().build(),
    ...ValidateIf(currentData.RG, ValidationBuilder.create("RG").required().build()),
    ...ValidateIf(!currentData.RG, [
        ...ValidationBuilder.create("documentType").required().build(),
        ...ValidationBuilder.create("documentNumber").required().build(),
        ...ValidationBuilder.create("documentValidity").required().build(),
        ...ValidationBuilder.create("numberOfBirthRegister").required().build(),
        ...ValidationBuilder.create("bookOfBirthRegister").required().build(),
        ...ValidationBuilder.create("pageOfBirthRegister").required().build(),
    ]),
    ...ValidationBuilder.create("rgIssuingAuthority").required().build(),
    ...ValidationBuilder.create("rgIssuingState").required().build(),
    ...ValidationBuilder.create("maritalStatus").required().build(),
    ...ValidationBuilder.create("skinColor").required().build(),
    ...ValidationBuilder.create("religion").required().build(),
    ...ValidationBuilder.create("educationLevel").required().build(),
    ...ValidateIf(currentData.specialNeeds, ValidationBuilder.create("specialNeedsDescription").required().build()),
    ...ValidationBuilder.create("landlinePhone").required().phone().build(),
    ...ValidationBuilder.create("workPhone").required().phone().build(),
    ...ValidationBuilder.create("contactNameForMessage").required().build(),
    ...ValidationBuilder.create("email").required().email().build(),
    ...ValidationBuilder.create("profession").required().build(),
    ...ValidateIf(currentData.enrolledGovernmentProgram, ValidationBuilder.create("NIS").required().number().build()),
])

export default familyMemberInfoValidation