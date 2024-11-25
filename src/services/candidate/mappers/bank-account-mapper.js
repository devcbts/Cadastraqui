import removeObjectFileExtension from "utils/remove-file-ext"

class BankAccountMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }
    fromPersistence(data) {
        // receive an array with all banking accounts
        // need to map and put the correct urls inside each month
        const { bankAccounts } = data
        const mappedData = bankAccounts.map((account) => {
            const { urls } = account
            account["months"] = []
            // urls will be like this -> url_3-2024 (month-year)
            const allUrls = removeObjectFileExtension(urls)
            try {

                Object.entries(allUrls).map(([key, value]) => {
                    const date = key.split('_')[1]
                    const [month, year] = date.split('-')
                    const monthDate = new Date(`${month}-01-${year}`)
                    const balance = account.balances?.find(e => new Date(e.date).getTime() === monthDate.getTime())
                    const { id, ...rest } = balance ?? {}
                    account["months"].push({
                        date: monthDate,
                        url_statement: value,
                        balanceid: id,
                        ...rest
                    })
                })
            } catch (err) {

            }
            return account
        })

        return mappedData
    }
}

export default new BankAccountMapper()