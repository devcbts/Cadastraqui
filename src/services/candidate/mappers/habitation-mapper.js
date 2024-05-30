const { default: removeObjectFileExtension } = require("utils/remove-file-ext")

class HabitationMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        return {
            ...data.housingInfo,
            uid: data.uid,
            ...removeObjectFileExtension(data.urls),
        }
    }
}

export default new HabitationMapper()