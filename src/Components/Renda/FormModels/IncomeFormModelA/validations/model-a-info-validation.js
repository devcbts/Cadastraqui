import ValidationBuilder from "../../../../../validation/builders/validation-builder";
import ValidationComposite from "../../../../../validation/composites/validation-composite";

const modelAInfoValidation = new ValidationComposite([
    ...ValidationBuilder.create("admissionDate").required().build(),
    ...ValidationBuilder.create("position").required().build(),
    ...ValidationBuilder.create("payingSource").required().build(),
    ...ValidationBuilder.create("payingSourcePhone").required().phone().build(),
    ...ValidationBuilder.create("gratificationAutonomous").required().build(),
])

export default modelAInfoValidation