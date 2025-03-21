import { ReactComponent as Edit } from 'Assets/icons/pencil.svg'
import ButtonBase from "Components/ButtonBase"
import FilePreview from 'Components/FilePreview'
import FormFilePicker from "Components/FormFilePicker"
import InputForm from "Components/InputForm"
import Spinner from 'Components/Loader/Spinner'
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useState } from "react"
import { ENTITY_GROUP_TYPE, ENTITY_GROUP_TYPE_MAPPER } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import FileInfo from '../FileCard/FileInfo'
import GroupedDocumentsGrid from "../GroupedDocumentsGrid"
import { useLegalFiles } from "../useLegalFiles"
import YearGrid from '../YearGrid'
import { informationRequestSchema } from "./schema"
export default function InformationRequest() {
    const initialFileState = {
        type: undefined,
        id: undefined,
        group: undefined,
        info: {
            certificate: undefined,
            answer: undefined,
        }
    }
    const [selectedFile, setSelectedFile] = useState(initialFileState)
    const [selectedYear, setSelectedYear] = useState()
    const { loading, documents, handleUploadFile, handleUpdateFile } = useLegalFiles({ type: 'INFORMATION_REQUEST' })
    const { control, handleSubmit, reset, getValues } = useControlForm({
        schema: informationRequestSchema(selectedFile.type),
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
            certificate, answer
        } = getValues()
        let fields = {};
        let files = [];

        // Define os valores corretos com base no tipo do documento
        if (selectedFile.type === ENTITY_GROUP_TYPE.INFORMATION_REQUEST_CERTIFICATE) {
            fields = { number: certificate?.number, expireAt: certificate?.expireAt, issuedAt: certificate?.issuedAt };
            files = certificate?.file ? [certificate.file] : [];
        } else if (selectedFile.type === ENTITY_GROUP_TYPE.INFORMATION_REQUEST_ANSWER) {
            fields = { issuedAt: answer?.issuedAt };
            files = answer?.file ? [answer.file] : [];
        }

        await handleUpdateFile({
            id: selectedFile.id,
            fields: fields,
            files: files,
        })
        handleModal()
    }

    const handleUpload = async () => {
        try {
            const {
                certificate: { file: c_file, number: c_number, expireAt: c_expire, issuedAt: c_issued },
                answer: { file: a_file, issuedAt: a_issued } } = getValues()
            const group = `group_${Date.now()}`
            await handleUploadFile({
                files: [
                    {
                        file: c_file, metadata: { document: ENTITY_GROUP_TYPE.INFORMATION_REQUEST_CERTIFICATE }, fields: {
                            year: selectedYear,
                            number: c_number,
                            expireAt: c_expire, issuedAt: c_issued
                        }
                    },
                    {
                        file: a_file, metadata: { document: ENTITY_GROUP_TYPE.INFORMATION_REQUEST_ANSWER }, fields: {
                            year: selectedYear,
                            issuedAt: a_issued
                        }
                    },
                ],
                metadata: {
                    year: selectedYear,
                    type: ENTITY_LEGAL_FILE.INFORMATION_REQUEST
                },
                type: ENTITY_LEGAL_FILE.INFORMATION_REQUEST,
                group
            }, selectedFile?.group)
            handleModal()
        }
        catch (err) {
        }
    }
    const getForm = (type) => {
        if (selectedFile.type === type || !selectedFile.type) {
            return true
        }
        return false
    }
    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Spinner size="24" />
            <strong>Carregando documentos da seção</strong>
        </div>
    }
    return (
        <>
            <strong>Solicitações de esclarecimentos e informações à entidade interessada (diligências - se houver e/ou processo de supervisão)</strong>
            <YearGrid
                container={{
                    onClick: setSelectedYear
                }}
                render={(year) => {

                    return (
                        <>
                            <strong>{year}</strong>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <ButtonBase label={'Adicionar'} onClick={handleModal} />
                            </div>
                        </>
                    )
                }}
            />
            <h1>{selectedYear}</h1>

            {selectedYear &&
                <GroupedDocumentsGrid
                    separator
                    documents={documents.filter(x => x.fields.year === selectedYear)}
                    order={[
                        ENTITY_GROUP_TYPE.INFORMATION_REQUEST_CERTIFICATE,
                        ENTITY_GROUP_TYPE.INFORMATION_REQUEST_ANSWER,
                    ]}
                    render={(docs, group, type) => {
                        const fields = docs.map(x => x.fields)

                        return (<div style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: 'center' }}>
                            <div style={{ display: "flex", alignItems: 'center', gap: '4px' }}>
                                {ENTITY_GROUP_TYPE_MAPPER[type]}
                                {docs.length === 1 &&
                                    <>
                                        <Edit width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => {
                                            setSelectedFile((prev) => {
                                                const values = {
                                                    ...prev.info,
                                                    ...(type === ENTITY_GROUP_TYPE.INFORMATION_REQUEST_CERTIFICATE && { certificate: fields[0] }),
                                                    ...(type === ENTITY_GROUP_TYPE.INFORMATION_REQUEST_ANSWER && { answer: fields[0] })
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
                                        <FileInfo doc={docs?.[0]} />

                                    </>
                                }
                            </div>
                            {docs.length === 0
                                ?
                                <strong style={{ cursor: 'pointer' }} onClick={() => {
                                    setSelectedFile({
                                        group
                                    })
                                    handleModal()
                                }}>Adicionar</strong>
                                : ((docs.length > 1)
                                    ? <strong style={{ cursor: 'pointer' }} onClick={() => {
                                        docs.map(({ url }) => window.open(url, '_blank'))
                                    }}>Ver todos ({docs.length})</strong>

                                    : <FilePreview text={'visualizar'} url={docs[0].url} />)
                            }
                        </div>)
                    }}
                />}
            <Modal open={isModalOpen}
                onClose={handleModal}
                onConfirm={handleSubmit(selectedFile.id ? handleUpdate : handleUpload)}
                title={selectedYear}
            >
                {getForm(ENTITY_GROUP_TYPE.INFORMATION_REQUEST_CERTIFICATE) &&
                    <>
                        <InputForm control={control} name={'certificate.number'} label={'Número do ofício'} />
                        <h3>Período da certificação</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(150px,1fr))', gap: 4 }}>
                            <InputForm control={control} name={'certificate.issuedAt'} label={'Início'} type="date" />
                            <InputForm control={control} name={'certificate.expireAt'} label={'Término'} type="date" />
                        </div>
                        <FormFilePicker control={control} name={'certificate.file'} label={'Arquivo'} accept={'application/pdf'} />
                    </>
                }
                {getForm(ENTITY_GROUP_TYPE.INFORMATION_REQUEST_ANSWER) &&
                    <>
                        <InputForm control={control} name={'answer.issuedAt'} label={'Resposta/data do protocolo'} type="date" />
                        <FormFilePicker control={control} name={'answer.file'} label={'Arquivo'} accept={'application/pdf'} />
                    </>
                }

            </Modal>
        </ >
    )
}