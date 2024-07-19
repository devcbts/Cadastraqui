import INCOME_SOURCE from "utils/enums/income-source"
import { formatCurrency } from "utils/format-currency";
import removeObjectFileExtension from "utils/remove-file-ext";

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
            income: INCOME_SOURCE.find((e) => e.value === key),
            // list: data[key].map(e => ({ ...e, url_document: Object.values(removeObjectFileExtension(e.urls))?.[0] }))
            list: data[key].map(e => {
                const obj = Object.entries(e).reduce((acc, [objKey, objValue]) => {
                    if (monetaryFields.includes(objKey)) {
                        acc[objKey] = Number(objValue).toLocaleString('pt-br', { style: "currency", currency: "brl" })
                        acc[`has${objKey}`] = !!Number(objValue)
                    } else {
                        if (objKey === 'urls') {
                            acc['url_document'] = Object.values(removeObjectFileExtension(objValue))?.[0]
                        } else {
                            acc[objKey] = objValue
                        }
                    }
                    return acc
                }, {})
                obj['isUpdated'] = true
                obj['skipMonth'] = !e.receivedIncome
                return obj
            })
        }))
        return mappedData
    }
}

export default new IncomeMapper()