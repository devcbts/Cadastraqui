import { ReactComponent as Edit } from 'Assets/icons/pencil.svg'
import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import InputForm from "Components/InputForm"
import Spinner from "Components/Loader/Spinner"
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useState } from "react"
import { ENTITY_GROUP_TYPE } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { formatCNPJ } from "utils/format-cnpj"
import { z } from "zod"
import DocumentHint from "../DocumentHint"
import GroupedDocumentsGrid from "../GroupedDocumentsGrid"
import DefaultCard from "../GroupedDocumentsGrid/DefaultCard"
import { useLegalFiles } from "../useLegalFiles"
export default function AccreditationAct() {
    const { loading, documents, handleUploadFile, handleUpdateFile, handleUpdateGroupFields } = useLegalFiles({ type: "ACCREDITATION_ACT" })
    const [openModal, setOpenModal] = useState(false)
    const [editCnpj, setEditCnpj] = useState({
        group: '',
        cnpj: ''
    })
    const { control, handleSubmit, getValues, reset } = useControlForm({
        schema: z.object({
            name: z.instanceof(File).nullish().refine(x => (!!x || editCnpj.cnpj), 'Arquivo obrigatório'),
            cnpj_file: z.instanceof(File).nullish().refine(x => (!!x || editCnpj.cnpj), 'Arquivo obrigatório'),
            cnpj: z.string().min(1, 'CNPJ obrigatório')
        }),
        defaultValues: {
            name: null,
            cnpj_file: null,
            cnpj: editCnpj.cnpj ?? ''
        }
    })
    const handleModal = () => {
        setOpenModal((prev) => {
            if (prev) {
                setEditCnpj({
                    cnpj: '',
                    group: ''
                })
            }
            return !prev
        })
        reset()
    }
    const handleUpload = async () => {
        const group = `group_${Date.now()}`
        await handleUploadFile({
            files: [
                { file: getValues('name'), metadata: { document: ENTITY_GROUP_TYPE.INSTITUTION_NAME } },
                { file: getValues('cnpj_file'), metadata: { document: ENTITY_GROUP_TYPE.CNPJ } }
            ],
            metadata: {
                type: ENTITY_LEGAL_FILE.ACCREDITATION_ACT,
            },
            fields: {
                cnpj: getValues('cnpj')
            },
            type: ENTITY_LEGAL_FILE.ACCREDITATION_ACT,
            group
        }).then(_ => handleModal())
    }
    const handleGroupFields = async () => {
        await handleUpdateGroupFields(editCnpj.group, { cnpj: getValues('cnpj') }).then(_ => handleModal())
    }
    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Spinner size="24" />
            <strong>Carregando documentos da seção</strong>
        </div>
    }
    return (
        <>
            <div style={{ display: 'flex', gap: '12px' }}>
                <ButtonBase label={'Novo'} onClick={handleModal} />
                <DocumentHint hint={
                    <>
                        <p>
                            Encaminhar a cópia do ato vigente de credenciamento/autorização de funcionamento de todas as instituições de educação vinculadas à mantenedora.
                        </p>
                        <p>
                            Esse documento, regularmente expedido pelo órgão normativo do sistema de ensino (Conselho ou Secretaria de Educação, MEC), deve conter a autorização de funcionamento da instituição de ensino, bem como os níveis de ensino que está habilitada a ofertar. É necessário encaminhar o documento que comprove tais informações (autorização, resolução, portaria, ou publicação do Diário Oficial).
                        </p>
                        <p>
                            Salienta-se que não se trata do alvará de funcionamento ou documento de utilidade pública municipal
                        </p>
                    </>
                } />
            </div>
            <GroupedDocumentsGrid
                documents={documents}
                separator
                order={[
                    ENTITY_GROUP_TYPE.INSTITUTION_NAME,
                    ENTITY_GROUP_TYPE.CNPJ,
                ]}
                container={(fields, groupId) => (<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {`CNPJ ${fields?.cnpj}`}
                    <Edit height={20} style={{ cursor: 'pointer' }} onClick={() => {
                        setEditCnpj({ group: groupId, cnpj: fields.cnpj })
                        handleModal()
                    }} />
                </div>)}
                render={(docs, groupId, type) =>
                    <DefaultCard
                        docs={docs}
                        type={type}
                        onUpdate={(id, file) => {
                            handleUpdateFile({ id, files: file })
                        }}
                    />
                }
            />

            <Modal open={openModal}
                onConfirm={handleSubmit(editCnpj ? handleGroupFields : handleUpload)}
                onClose={handleModal}
            >
                <InputForm name={'cnpj'} label={'CNPJ da unidade educacional'} control={control} transform={(e) => formatCNPJ(e.target.value)} />
                {!editCnpj.cnpj && <>
                    <FormFilePicker control={control} name={"name"} label={'Autorização de funcionamento'} accept={'application/pdf'} />
                    <FormFilePicker control={control} name={"cnpj_file"} label={'Cartão do CNPJ'} accept={'application/pdf'} />
                </>
                }
            </Modal>

        </ >
    )
}