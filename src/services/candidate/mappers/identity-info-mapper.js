import { formatCPF } from "utils/format-cpf"
import removeObjectFileExtension from "utils/remove-file-ext"

class IdentityInfoMapper {
    toPersistence(data) {
        throw Error('not implemented yet')
    }

    fromPersistence(data) {

        const { identityInfo } = data
        if (!identityInfo) return null
        let documentValidity = null;
        if (identityInfo?.documentValidity) {
            documentValidity = identityInfo.documentValidity.split('T')?.[0]
        }
        const deleteFolder = Object.keys(data?.urls)?.[0]
        const urls = removeObjectFileExtension(data.urls)
        const hasResidenceProof = !!Object.keys(urls).includes("url_residenceProof")
        return {
            ...identityInfo, CPF: formatCPF(identityInfo.CPF),
            birthDate: identityInfo.birthDate?.split('T')?.[0],
            ...urls,
            deleteFolder,
            hasResidenceProof,
            documentValidity
        }
    }
}

export default new IdentityInfoMapper()