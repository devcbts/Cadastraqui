import { toFloat } from "../../../../utils/currency-to-float";

export default function toPersistence(source, values) {
    return {
        incomeSource: source,
        quantity: values.length,
        incomes: values.map((obj) => {
            const monetaryFields = [
                "grossAmount", "incomeTax", "publicPension", "otherDeductions",
                "foodAllowanceValue", "transportAllowanceValue", "expenseReimbursementValue",
                "advancePaymentValue", "reversalValue", "compensationValue", "judicialPensionValue", "proLabore", "dividends", "parcelValue", "deductionValue",
                "parcels", "parcelValue"
            ];

            return ({

                ...Object.keys(obj).reduce((acc, key) =>
                    monetaryFields.includes(key) ?
                        ({
                            ...acc, [key]: toFloat(obj[key])
                        })
                        : { ...acc, [key]: obj[key] }
                    , {})

            })
        })
    }
}