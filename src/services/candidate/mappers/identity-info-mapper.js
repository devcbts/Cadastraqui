import { formatCPF } from "utils/format-cpf"

class IdentityInfoMapper {
    toPersistence(data) {
        throw Error('not implemented yet')
    }

    fromPersistence(data) {
        return { ...data, CPF: formatCPF(data.CPF), birthDate: data.birthDate?.split('T')?.[0] }
    }
}

export default new IdentityInfoMapper()