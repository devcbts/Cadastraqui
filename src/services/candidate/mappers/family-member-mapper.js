import { formatTelephone } from "utils/format-telephone"

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
            phone: formatTelephone(data.landlinePhone)
        }
    }
}

export default new FamilyMemberMapper()