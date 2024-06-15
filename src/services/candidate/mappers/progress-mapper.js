class ProgressMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }
    fromPersistence(data) {
        const {
            id, candidate_id, responsible_id, ...rest
        } = data
        return rest
    }
}

export default new ProgressMapper()