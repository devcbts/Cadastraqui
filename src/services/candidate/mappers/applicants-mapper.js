class ApplicantsMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        const { applicants } = data
        if (applicants instanceof Array) {
            return applicants.map((e) => ({ label: e.name, value: e.id }))
        } else {
            return { name: applicants.name, id: applicants.id }
        }
    }
}

export default new ApplicantsMapper()