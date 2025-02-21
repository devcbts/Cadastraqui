import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { useLegalFiles } from "../useLegalFiles"
import DocumentGridView from "./DocumentGridView"
import FileUploaderButton from './FileUploaderButton'

/**
 * @typedef {Object} GridOptions
 * @property {'last' | (string & {}) | (index:number)=> string} [title] 
 * @property {number} [columns] - default is 2
 * @property {(documents:any[])=> any[]} [transform] - apply some transformation on documents array before rendering 
 * @property {{count: number} | boolean} [year]  
*/
/**
 * 
 * @param {Object} props 
 * @param {boolean} [props.multiple] - default is false 
 * @param {string} props.type 
 * @param {import("utils/create-legal-document-form-data").IMetadata} [props.metadata] 
 * @param {GridOptions} [props.gridOptions]
 * @param {'card'| 'button'} [props.add] - which way to add a new file/form, default button
 * @returns 
 */
export default function DocumentUpload({
    multiple,
    type,
    metadata,
    gridOptions,
    add,
} = {
        gridOptions: {
            columns: 2,
            title: '',
            transform: (x) => x,
            year: false
        },
        add: 'button'
    }) {
    const { documents, handleUploadFile } = useLegalFiles({ type: type })


    const handleUpload = async (files, e) => {
        await handleUploadFile({
            files: files,
            metadata: {
                type: ENTITY_LEGAL_FILE[type],
                ...metadata
            },
            fields: {
                ...(gridOptions.year && { year: e })
            },
            type: ENTITY_LEGAL_FILE[type],
        })
    }


    return (
        <>
            {add === 'button' && <FileUploaderButton multiple={multiple} onUpload={handleUpload} />}
            <DocumentGridView
                documents={documents}
                {...gridOptions}
                {...((add === 'card' | !!gridOptions.year) && { onDocumentClick: handleUpload })}
                {...(!!gridOptions.year && { columns: 4 })}
            />
            {/* <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                <FormFilePicker accept={'application/pdf'} label={'arquivo'} name={'file'} control={control} multiple />
                <ButtonBase onClick={handleSubmit(handleUpload)} label={'enviar'} />
            </div> */}
        </>
    )
}