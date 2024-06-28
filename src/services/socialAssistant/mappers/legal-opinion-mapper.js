const { default: removeObjectFileExtension } = require("utils/remove-file-ext");

class LegalOpinionMapper {
    fromPersistence(data) {
        return ({
            ...data,
            majoracao: removeObjectFileExtension(data?.majoracao)?.["url_majoracao"] ?? null,
            additional: removeObjectFileExtension(data?.aditional)?.["url_aditional"] ?? null,
        })
    }
}

export default new LegalOpinionMapper()