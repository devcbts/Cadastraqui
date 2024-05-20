import { formatCNPJ } from "utils/format-cnpj"

class EmployementTypeMapper {
    toPersistence(data) {
        return {
            ...data,
            employmentType: data.incomeSource
        }
    }
    fromPersistence(data) {

        const mappedData = data?.map((e) => ({
            ...e,
            CNPJ: formatCNPJ(e.CNPJ),
            parcelValue: Number(e.parcelValue).toLocaleString('pt-br', { style: "currency", currency: "brl" }),
            firstParcelDate: e.firstParcelDate?.split('T')[0]
        }))
        return mappedData
    }
}

export default new EmployementTypeMapper()