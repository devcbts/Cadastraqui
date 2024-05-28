import { formatTelephone } from "utils/format-telephone"
import removeObjectFileExtension from "utils/remove-file-ext"

const { formatCPF } = require("utils/format-cpf")

class FamilyMemberMapper {
    toPersistence(data) {
        return {
            ...data,
            landlinePhone: data.phone
        }
    }
    fromPersistence(data) {
        return {
            ...data,
            CPF: formatCPF(data.CPF),
            birthDate: data.birthDate.split('T')?.[0],
            phone: formatTelephone(data.landlinePhone),
            ...removeObjectFileExtension(data.urls)
        }
    }
}

export default new FamilyMemberMapper()