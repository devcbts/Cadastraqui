import INCOME_SOURCE from "utils/enums/income-source"
import { formatCurrency } from "utils/format-currency";

class IncomeMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        const monetaryFields = [
            "grossAmount", "incomeTax", "publicPension", "otherDeductions",
            "foodAllowanceValue", "transportAllowanceValue", "expenseReimbursementValue",
            "advancePaymentValue", "reversalValue", "compensationValue", "judicialPensionValue", "proLabore", "dividends", "parcelValue", "deductionValue",
            "parcels", "parcelValue"
        ];

        const mappedData = Object.keys(data).map((key) => ({
            income: INCOME_SOURCE.find((e) => e.value === key), list: data[key].map(e => {
                const obj = Object.entries(e).reduce((acc, [objKey, objValue]) => {
                    if (monetaryFields.includes(objKey)) {
                        acc[objKey] = Number(objValue).toLocaleString('pt-br', { style: "currency", currency: "brl" })
                        acc[`has${objKey}`] = !!Number(objValue)
                    } else {
                        acc[objKey] = objValue
                    }
                    return acc
                }, {})
                return obj
            })
        }))
        return mappedData
    }
}

export default new IncomeMapper()