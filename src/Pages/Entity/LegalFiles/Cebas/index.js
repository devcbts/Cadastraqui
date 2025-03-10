import { ReactComponent as Edit } from 'Assets/icons/pencil.svg'
import ButtonBase from "Components/ButtonBase"
import FilePreview from "Components/FilePreview"
import FormFilePicker from "Components/FormFilePicker"
import InputForm from 'Components/InputForm'
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useState } from "react"
import { ENTITY_GROUP_TYPE, ENTITY_GROUP_TYPE_MAPPER } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import GroupedDocumentsGrid from "../GroupedDocumentsGrid"
import { useLegalFiles } from "../useLegalFiles"
import { cebasSchema } from './schema'
export default function Cebas() {
    const initialFileState = {
        type: undefined,
        id: undefined,
        info: {
            certificate: undefined,
            deadline: undefined,
            education: undefined,
            notes_copy: undefined
        }
    }
    const [selectedFile, setSelectedFile] = useState(initialFileState)
    const { documents, handleUploadFile, handleUpdateFile } = useLegalFiles({ type: 'CEBAS' })
    const { control, handleSubmit, reset, getValues } = useControlForm({
        schema: cebasSchema(selectedFile.type),
        defaultValues: selectedFile.info
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleModal = () => {
        setIsModalOpen(prev => {
            if (prev) {
                setSelectedFile(initialFileState)
            }
            return !prev
        })
        reset()
    }
    const handleUpdate = async () => {
        const {
            certificate, deadline, education, notes_copy
        } = getValues()
        let fields = {};
        let files = [];

        // Define os valores corretos com base no tipo do documento
        if (selectedFile.type === ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE) {
            fields = { expireAt: certificate?.expireAt, issuedAt: certificate?.issuedAt };
            files = certificate?.file ? [certificate.file] : [];
        } else if (selectedFile.type === ENTITY_GROUP_TYPE.CEBAS_EXTENSION) {
            fields = { expireAt: deadline?.expireAt };
            files = deadline?.file ? [deadline.file] : [];
        } else if (selectedFile.type === ENTITY_GROUP_TYPE.CEBAS_EDUCATION) {
            files = education ? [education] : [];
        } else if (selectedFile.type === ENTITY_GROUP_TYPE.CEBAS_NOTES_COPY) {
            files = notes_copy ? [notes_copy] : [];
        }

        await handleUpdateFile({
            id: selectedFile.id,
            fields: fields,
            files: files,
        })
    }

    const handleUpload = async () => {
        try {
            const {
                education,
                notes_copy,
                certificate: { file: c_file, expireAt: c_expire, issuedAt: c_issued },
                deadline: { file: d_file, expireAt: d_expire } } = getValues()
            const group = `group_${Date.now()}`
            await handleUploadFile({
                files: [
                    { file: c_file, metadata: { document: ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE }, fields: { expireAt: c_expire, issuedAt: c_issued } },
                    { file: d_file, metadata: { document: ENTITY_GROUP_TYPE.CEBAS_EXTENSION }, fields: { expireAt: d_expire } },
                    { file: notes_copy, metadata: { document: ENTITY_GROUP_TYPE.CEBAS_NOTES_COPY } },
                    { file: education, metadata: { document: ENTITY_GROUP_TYPE.CEBAS_EDUCATION } },
                ],
                metadata: {
                    type: ENTITY_LEGAL_FILE.CEBAS
                },
                type: ENTITY_LEGAL_FILE.CEBAS,
                group
            })
        }
        catch (err) {
        }
        handleModal()
    }
    const getForm = (type) => {
        if (selectedFile.type === type || !selectedFile.type) {
            return true
        }
        return false
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
                <ButtonBase label={'Novo'} onClick={handleModal} />
            </div>
            <strong>
                Será considerado tempestivo o requerimento de renovação da certificação protocolado no decorrer dos
                360 (trezentos e sessenta) dias que antecedem a data final de validade da certificação.
            </strong>


            <GroupedDocumentsGrid
                order={[
                    ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE,
                    ENTITY_GROUP_TYPE.CEBAS_EXTENSION,
                    ENTITY_GROUP_TYPE.CEBAS_NOTES_COPY,
                    ENTITY_GROUP_TYPE.CEBAS_EDUCATION,
                ]}
                documents={documents}
                render={(docs, groupId, type) => {
                    const fields = docs.map(x => x.fields)
                    return (<div style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: 'center' }}>
                        <div style={{ display: "flex", alignItems: 'center', gap: '4px' }}>
                            {ENTITY_GROUP_TYPE_MAPPER[type]}
                            {docs.length === 1 &&
                                <Edit width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => {
                                    setSelectedFile((prev) => {
                                        const values = {
                                            ...prev.info,
                                            ...(type === ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE && { certificate: fields[0] }),
                                            ...(type === ENTITY_GROUP_TYPE.CEBAS_EXTENSION && { deadline: fields[0] })
                                        }
                                        return ({
                                            id: docs[0].id,
                                            type,
                                            info: values
                                        })

                                    }
                                    )

                                    handleModal()
                                }} />
                            }
                        </div>
                        {docs.length === 0
                            ?
                            <strong style={{ cursor: 'pointer' }} onClick={() => handleModal(type)}>Adicionar</strong>
                            : ((docs.length > 1)
                                ? <strong style={{ cursor: 'pointer' }} onClick={() => {
                                    docs.map(({ url }) => window.open(url, '_blank'))
                                }}>Ver todos ({docs.length})</strong>

                                : <FilePreview text={'visualizar'} url={docs[0].url} />)
                        }
                    </div>

                    )
                }
                }
                separator
            />
            <Modal open={isModalOpen}
                onClose={handleModal}
                onConfirm={handleSubmit(selectedFile.id ? handleUpdate : handleUpload)}
            >
                {getForm(ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE) &&
                    <>
                        <h3>Certificação concedida</h3>
                        <InputForm control={control} name={'certificate.expireAt'} label={'Início'} type="date" />
                        <InputForm control={control} name={'certificate.issuedAt'} label={'Término'} type="date" />
                        <FormFilePicker control={control} name={'certificate.file'} label={'Arquivo'} accept={'application/pdf'} />
                    </>
                }
                {getForm(ENTITY_GROUP_TYPE.CEBAS_EXTENSION) &&
                    <>
                        <h3>Em caso de prorrogação do prazo de vigência, anexar a Portaria e inserir a nova data de término.</h3>
                        <InputForm control={control} name={'deadline.expireAt'} label={'Término'} type="date" />
                        <FormFilePicker control={control} name={'deadline.file'} label={'Arquivo'} accept={'application/pdf'} />
                    </>
                }
                {getForm(ENTITY_GROUP_TYPE.CEBAS_EDUCATION) &&
                    <FormFilePicker control={control} name={'education'} label={'Certidão CEBAS-Educação'} accept={'application/pdf'}
                        tooltip='Certidão referente à Certificação de Entidade Beneficente de Assistência Social na área de educação (CEBAS)' />}
                {getForm(ENTITY_GROUP_TYPE.CEBAS_NOTES_COPY) && <FormFilePicker control={control} name={'notes_copy'} label={'Cópia de notas técnicas dos processos CEBAS – Educação'} accept={'application/pdf'}
                    tooltip='Cópia de nota(s) técnica(s) da Certificação de Entidades Beneficentes de Assistência Social na área de educação (CEBAS) protocolado junto ao SEI.' />
                }
            </Modal>
        </div>
    )
}