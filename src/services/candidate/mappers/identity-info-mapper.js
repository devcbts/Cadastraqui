import { formatCPF } from "utils/format-cpf"
import removeObjectFileExtension from "utils/remove-file-ext"

class IdentityInfoMapper {
    toPersistence(data) {
        throw Error('not implemented yet')
    }

    fromPersistence(data) {
        return { ...data, CPF: formatCPF(data.CPF), birthDate: data.birthDate?.split('T')?.[0], ...removeObjectFileExtension(data.urls) }
    }
}

export default new IdentityInfoMapper()