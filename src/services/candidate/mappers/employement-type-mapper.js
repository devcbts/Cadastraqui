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
            incomes: e.incomes.map((i) => ({
                ...i,
                CNPJ: formatCNPJ(i.CNPJ),
                parcelValue: i.parcelValue ? Number(i.parcelValue).toLocaleString('pt-br', { style: "currency", currency: "brl" }) : null,
                firstParcelDate: i.firstParcelDate?.split('T')[0],
                admissionDate: i.admissionDate?.split('T')[0],
            }))
        }))
        console.log(mappedData)
        return mappedData
    }
}

export default new EmployementTypeMapper()