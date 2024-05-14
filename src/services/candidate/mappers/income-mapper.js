import INCOME_SOURCE from "utils/enums/income-source"

class IncomeMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        const mappedData = Object.keys(data).map((key) => ({ income: INCOME_SOURCE.find((e) => e.value === key), list: data[key] }))
        return mappedData
    }
}

export default new IncomeMapper()