import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import React, { useState } from "react"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { getDefaultSchemaValues } from "utils/get-default-schema-values"
import { z, ZodObject } from "zod"
import DocumentHint from '../DocumentHint'
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
 * @param {string | React.JSX.Element} [props.hint]
 * @param {React.JSX.Element} [props.details]
 * @param {GridOptions} [props.gridOptions]
 * @param {'file'| 'form'} [props.add] - which way to add a new row - default is file
 * @param {{schema: ZodObject, items: ({Component: React.JSX.Element,label:string,name:string}|React.JSX.Element)[]}} [props.form] - 'file' is a default field if form is present,
 *  each individual field will be passes on
 * "fields" property of returned formData
 * @returns 
 */
export default function DocumentUpload({
    multiple,
    type,
    metadata,
    gridOptions = {
        columns: 2,
        title: '',
        transform: (x) => x,
        year: false
    },
    details = undefined,
    add = "file",
    form = undefined,
    hint = null
}) {
    const { documents, handleUploadFile } = useLegalFiles({ type: type })
    const { control, getValues, handleSubmit, reset } = useControlForm({
        schema: z.object({
            file: z.instanceof(File).nullish().refine(v => !!v, 'Arquivo obrigatório'),
            ...form?.schema?.shape ?? {}
        }),
        defaultValues: {
            file: null,
            ...getDefaultSchemaValues(form?.schema)
        }
    })

    const handleUpload = async (files, fields) => {
        await handleUploadFile({
            files: files,
            metadata: {
                type: ENTITY_LEGAL_FILE[type],
                ...metadata
            },
            fields: fields && {
                ...fields
            },
            type: ENTITY_LEGAL_FILE[type],
        })
        if (!!form) {
            handleModal()
        }
    }
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleModal = () => {
        setIsModalOpen((prev) => !prev)
        reset()
    }
    const getAllFieldValues = () => {
        let values = {}
        for (const x of Object.keys(form?.schema.shape)) {
            console.log(x)
            values[x] = getValues(x)
        }
        return values
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>

                {!gridOptions.year && (
                    add === 'file'
                        ? <FileUploaderButton multiple={multiple} onUpload={handleUpload} />
                        : <ButtonBase label={'Novo'} onClick={handleModal} />
                )}
                <DocumentHint hint={hint} />
            </div>


            {!!details && (
                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                    {details}
                </div>
            )}
            <DocumentGridView
                documents={documents}
                {...gridOptions}
                {...((!!gridOptions.year) && {
                    onDocumentClick: (
                        add === 'file'
                            ? (files, year) => handleUpload(files, { year })
                            : handleModal
                    ), columns: 4
                })}
            />
            <Modal open={isModalOpen} title={'Adicionar'}
                onConfirm={handleSubmit(() => handleUpload(getValues('file'),
                    getAllFieldValues()
                ))}
                onClose={() => handleModal()}>

                <div style={{ width: 'max(280px,60%)', display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'self-start' }}>
                    {form?.items.map((x, index) => {
                        if (React.isValidElement(x)) {
                            return React.cloneElement(x)
                        }
                        const { Component, ...rest } = x
                        return <Component key={index} {...rest} control={control} />
                    })}
                    <FormFilePicker accept={'application/pdf'} label={'arquivo'} name={'file'} control={control} />
                </div>
            </Modal>
        </>
    )
}