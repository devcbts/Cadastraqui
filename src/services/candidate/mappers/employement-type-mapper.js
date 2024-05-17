class EmployementTypeMapper {
    toPersistence(data) {
        return {
            ...data,
            employmentType: data.incomeSource
        }
    }
    fromPersistence(data) {
        throw Error('not implemented')
    }
}

export default new EmployementTypeMapper()