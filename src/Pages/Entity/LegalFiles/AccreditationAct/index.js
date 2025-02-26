import ButtonBase from "Components/ButtonBase"
import FilePreview from "Components/FilePreview"
import FormFilePicker from "Components/FormFilePicker"
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useState } from "react"
import { ENTITY_GROUP_TYPE } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import DocumentHint from "../DocumentHint"
import { useLegalFiles } from "../useLegalFiles"

export default function AccreditationAct({
    hint = undefined,
}) {
    const { documents, handleUploadFile } = useLegalFiles({ type: "ACCREDITATION_ACT" })
    const [openModal, setOpenModal] = useState(false)
    const { control, handleSubmit, getValues, reset } = useControlForm({
        schema: z.object({
            name: z.instanceof(File).refine(x => !!x, 'Arquivo obrigatório'),
            cnpj: z.instanceof(File).refine(x => !!x, 'Arquivo obrigatório'),
        }),
        defaultValues: {
            name: null,
            cnpj: null
        }
    })
    const handleModal = () => {
        setOpenModal((prev) => !prev)
        reset()
    }
    const handleUpload = async () => {
        const group = `group_${Date.now()}`
        await handleUploadFile({
            files: [
                { file: getValues('name'), metadata: { document: ENTITY_GROUP_TYPE.INSTITUTION_NAME } },
                { file: getValues('cnpj'), metadata: { document: ENTITY_GROUP_TYPE.CNPJ } }
            ],
            metadata: {
                type: ENTITY_LEGAL_FILE.ACCREDITATION_ACT,
            },
            type: ENTITY_LEGAL_FILE.ACCREDITATION_ACT,
            group
        })
    }
    const groupedDocuments = documents.reduce((acc, curr) => {
        acc[curr.group] = [...acc[curr.group] ?? [], curr]
        return acc
    }, {})
    return (
        <>
            <div style={{ display: 'flex', gap: '12px' }}>

                <ButtonBase label={'Novo'} onClick={handleModal} />
                <DocumentHint hint={hint} />
            </div>
            {Object.entries(groupedDocuments).map(([group, docs]) => (
                <div style={{ display: 'flex', padding: '12px', marginTop: '8px', borderRadius: 8, backgroundColor: 'white' }}>
                    {docs.map((doc, index) => (
                        <>
                            <div style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: 'center' }}>
                                {doc.metadata?.document}
                                <FilePreview text={'visualizar'} url={doc.url} />
                            </div>
                            {index < docs.length - 1 && (
                                <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 10px' }} />
                            )}
                        </>
                    ))}
                </div>
            ))}
            <Modal open={openModal}
                onConfirm={handleSubmit(handleUpload)}
                onCancel={handleModal}
            >
                <FormFilePicker control={control} name={"name"} label={'Nome da unidade educacional'} accept={'application/pdf'} />
                <FormFilePicker control={control} name={"cnpj"} label={'CNPJ'} accept={'application/pdf'} />
            </Modal>

        </ >
    )
}