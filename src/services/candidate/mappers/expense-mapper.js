import moneyInputMask from "Components/MoneyFormInput/money-input-mask"
import expenseDescriptionAndField from "Pages/SubscribeForm/components/Form_Expenses/utils/expenseDescriptionAndField"

class ExpenseMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        try {
            const { expenses } = data
            const mappedData = expenses.map((expense) => {
                const mappedExpenses = Object.keys(expense).reduce((acc, key) => {
                    const isMoney = expenseDescriptionAndField.find((e) => e.field === key)
                    if (isMoney) {
                        acc[`${key}`] = moneyInputMask(expense[`${key}`].toString())
                    } else {
                        acc[`${key}`] = expense[`${key}`]
                    }
                    return acc
                }, {})
                const mappedAdditionalExpenses = () => {
                    let additionalExpenses = []
                    const descriptions = expense.otherExpensesDescription
                    const values = expense.otherExpensesValue

                    //Assuming every description has a value (SHOULD!!)
                    descriptions.forEach((e, i) => {
                        additionalExpenses.push({ description: e, value: moneyInputMask(values[i].toString()) })
                    })
                    return additionalExpenses
                }
                return {
                    ...mappedExpenses,
                    additionalExpenses: mappedAdditionalExpenses()
                }
            })
            return { months: mappedData }
        }
        catch (err) { }
    }
}
export default new ExpenseMapper()