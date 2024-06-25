import { formatCPF } from "utils/format-cpf"

class BasicInfoMapper {
    fromPersistence(data) {
        const { email, CPF, phone, CRESS, name } = data.assistant
        return {
            email, CPF: formatCPF(CPF), phone, CRESS, name
        }
    }
}

export default new BasicInfoMapper()