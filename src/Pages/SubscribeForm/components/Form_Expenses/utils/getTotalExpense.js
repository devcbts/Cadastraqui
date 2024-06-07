import moneyInputMask from "Components/MoneyFormInput/money-input-mask"
import stringToFloat from "utils/string-to-float";

export default function getTotalExpense(data) {
    const total = Object.values(data).reduce((acc, value) => {
        if (typeof value === 'string' || typeof value === 'number') {
            acc += stringToFloat(value)
        }
        if (value instanceof Array) {
            // instance of array ([{description:'',value:''}])
            acc += value?.reduce((arrayAcc, e) => {
                arrayAcc += stringToFloat(e.value.toString())
                return arrayAcc
            }, 0)
        }
        return acc
    }, 0)
    return moneyInputMask(total.toFixed(2))
}