import { formatCPF } from "utils/format-cpf"
import removeObjectFileExtension from "utils/remove-file-ext"

class IdentityInfoMapper {
    toPersistence(data) {
        throw Error('not implemented yet')
    }

    fromPersistence(data) {
        const { identityInfo } = data
        if (!identityInfo) return null
        return { ...identityInfo, CPF: formatCPF(identityInfo.CPF), birthDate: identityInfo.birthDate?.split('T')?.[0], ...removeObjectFileExtension(data.urls) }
    }
}

export default new IdentityInfoMapper()