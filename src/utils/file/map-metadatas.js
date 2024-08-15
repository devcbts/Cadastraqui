import findLabel from "utils/enums/helpers/findLabel";
import METADATA_FILE_CATEGORY from "./metadata-file-category";
import METADATA_FILE_TYPE from "./metadata-file-type";
import DISEASES from "utils/enums/diseases";
import METADATA_TYPE_MAPPER from "./metadata-type-mapper";

export default function mapMetadatas(file) {
    if (!file) return ''
    const { fileMetadata } = file
    // if (!fileMetadata?.category) return ''
    const type = METADATA_TYPE_MAPPER[fileMetadata?.type]
    if (!type) return ''
    switch (fileMetadata?.category) {
        case METADATA_FILE_CATEGORY.Disease:
            return `${type} ${fileMetadata?.disease ? `(${findLabel(DISEASES, fileMetadata?.disease)})` : ''}`
        case METADATA_FILE_CATEGORY.Medication:
            return `${type} ${fileMetadata?.medication ? `(${fileMetadata?.medication})` : ''}`
        case METADATA_FILE_CATEGORY.Statement:
            return `${type} ${fileMetadata?.date ? `(${new Date(fileMetadata?.date).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })})` : ''}`
        case METADATA_FILE_CATEGORY.Registrato:
            return `${type} ${fileMetadata?.date ? `(${new Date(fileMetadata?.date).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })})` : ''}`

        default:
            return `${type}`
    }
}