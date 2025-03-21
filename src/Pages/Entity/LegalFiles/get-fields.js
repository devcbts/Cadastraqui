import formatDate from "utils/format-date"

const legalFieldsMapper = {
    'start': { translate: 'Data inicial/expedição', type: 'date' },
    'issuedAt': { translate: 'Data inicial/expedição', type: 'date' },
    'end': { translate: 'Data final/expiração', type: 'date' },
    'expireAt': { translate: 'Data final/expiração', type: 'date' },
    'year': { translate: 'Referente à', type: 'number' }
}

export default function getLegalFields(fields) {
    if (!fields) {
        return ['Documento sem informação adicional']
    }
    const result = []
    Object.entries(fields).forEach(([k, v]) => {
        const field = legalFieldsMapper[k]
        if (field) {
            let newValue = v
            if (field.type === 'date') {
                newValue = formatDate(v)
            }
            result.push(`${field.translate}: ${newValue}`)
        }
    })
    return result
}