import { formatCNPJ } from "utils/format-cnpj"

class EmployementTypeMapper {
    toPersistence(data) {
        return {
            ...data,
            employmentType: data.incomeSource
        }
    }
    fromPersistence(data) {
        const { incomeInfoResults, averageIncome } = data
        const mappedData = incomeInfoResults?.map((e) => ({
            ...e,
            months: e.incomes.map((i) => ({
                ...i,
                CNPJ: formatCNPJ(i.CNPJ),
                parcelValue: i.parcelValue ? Number(i.parcelValue).toLocaleString('pt-br', { style: "currency", currency: "brl" }) : null,
                firstParcelDate: i.firstParcelDate?.split('T')[0],
                admissionDate: i.admissionDate?.split('T')[0],
            }))
        }))
        const mappedIncome = new Number(averageIncome).toLocaleString('pt-br', { style: 'currency', currency: 'brl' })
        return { incomes: mappedData, avgFamilyIncome: mappedIncome }
    }
}

export default new EmployementTypeMapper()