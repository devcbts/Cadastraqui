const { default: removeObjectFileExtension } = require("utils/remove-file-ext");

class LegalOpinionMapper {
    fromPersistence(data) {
        return ({
            ...data,
            majoracao: removeObjectFileExtension(data?.majoracao)?.["url_majoracao"] ?? null,
            additional: data.application.aditionalInfo,
        })
    }
}

export default new LegalOpinionMapper()