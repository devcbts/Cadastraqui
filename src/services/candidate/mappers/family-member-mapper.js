import { formatTelephone } from "utils/format-telephone"
import removeObjectFileExtension from "utils/remove-file-ext"

const { formatCPF } = require("utils/format-cpf")

class FamilyMemberMapper {
    toPersistence(data) {
        return {
            ...data,
        }
    }
    fromPersistence(data) {
        return {
            ...data,
            CPF: formatCPF(data.CPF),
            birthDate: data.birthDate.split('T')?.[0],
            landlinePhone: formatTelephone(data.landlinePhone),
            ...removeObjectFileExtension(data.urls)
        }
    }
}

export default new FamilyMemberMapper()