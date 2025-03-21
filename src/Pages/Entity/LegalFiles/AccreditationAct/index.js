import ButtonBase from "Components/ButtonBase"
import FilePreview from "Components/FilePreview"
import FormFilePicker from "Components/FormFilePicker"
import Spinner from "Components/Loader/Spinner"
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useState } from "react"
import { ENTITY_GROUP_TYPE, ENTITY_GROUP_TYPE_MAPPER } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import DocumentHint from "../DocumentHint"
import GroupedDocumentsGrid from "../GroupedDocumentsGrid"
import { useLegalFiles } from "../useLegalFiles"

export default function AccreditationAct() {
    const { loading, documents, handleUploadFile } = useLegalFiles({ type: "ACCREDITATION_ACT" })
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
                render={(docs) => (docs.map(doc => (
                    <div style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: 'center' }}>
                        {ENTITY_GROUP_TYPE_MAPPER[doc.metadata?.document]}
                        <FilePreview text={'visualizar'} url={doc.url} />
                    </div>)
                ))}
            />

            <Modal open={openModal}
                onConfirm={handleSubmit(handleUpload)}
                onClose={handleModal}
            >
                <FormFilePicker control={control} name={"name"} label={'Nome da unidade educacional'} accept={'application/pdf'} />
                <FormFilePicker control={control} name={"cnpj"} label={'CNPJ'} accept={'application/pdf'} />
            </Modal>

        </ >
    )
}