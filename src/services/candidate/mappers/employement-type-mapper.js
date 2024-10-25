import { formatCNPJ } from "utils/format-cnpj"
import { formatCPF } from "utils/format-cpf"
import removeObjectFileExtension from "utils/remove-file-ext"

class EmployementTypeMapper {
    toPersistence(data) {
        return {
            ...data,
            employmentType: data.incomeSource
        }
    }
    fromPersistence(data) {
        const { incomeInfoResults, averageIncome } = data
        const formatCPFCNPJ = (str) => {
            if (str?.toString().replace(/\D/g, '').length === 11) return formatCPF(str)
            return formatCNPJ(str)
        }
        const mappedData = incomeInfoResults?.map((e) => ({
            ...e,
            months: e.incomes.map((i) => {
                return ({
                    ...i,
                    CNPJ: formatCPFCNPJ(i.CNPJ),
                    parcelValue: i.parcelValue ? Number(i.parcelValue).toLocaleString('pt-br', { style: "currency", currency: "brl" }) : null,
                    firstParcelDate: i.firstParcelDate?.split('T')[0],
                    admissionDate: i.admissionDate?.split('T')[0],
                    startDate: i.startDate?.split('T')[0],
                    ...removeObjectFileExtension(i?.urls),
                })
            }),
            averageIncome: new Number(e.averageIncome).toLocaleString('pt-br', { style: 'currency', currency: 'brl' }),
        }))

        const mappedIncome = new Number(averageIncome).toLocaleString('pt-br', { style: 'currency', currency: 'brl' })
        return { incomes: mappedData, avgFamilyIncome: mappedIncome }
    }
}

export default new EmployementTypeMapper()