import { ReactComponent as Edit } from 'Assets/icons/pencil.svg'
import ButtonBase from "Components/ButtonBase"
import CustomFilePicker from "Components/CustomFilePicker"
import FilePreview from "Components/FilePreview"
import FormFilePicker from "Components/FormFilePicker"
import FormSelect from "Components/FormSelect"
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useMemo, useState } from "react"
import { ENTITY_GROUP_TYPE, ENTITY_GROUP_TYPE_MAPPER } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import GroupedDocumentsGrid from "../GroupedDocumentsGrid"
import { useLegalFiles } from "../useLegalFiles"
export default function Announcement() {
    const { documents, handleUploadFile, handleUpdateFile } = useLegalFiles({ type: 'ANNOUNCEMENT' })
    const { control, watch, handleSubmit, reset, getValues, formState: { errors } } = useControlForm({
        schema: z.object({
            announcement: z.instanceof(File).nullish(),
            year: z.number(),
            disclosure_proof: z.instanceof(FileList).nullish(),
            social_assistant_opinion: z.instanceof(File).nullish(),
            final_result: z.instanceof(File).nullish(),
        }).refine((data) => (
            data.announcement
            || data.disclosure_proof?.length > 0
            || data.final_result
            || data.social_assistant_opinion

        ), 'Anexe pelo menos um arquivo'),
        defaultValues: {
            announcement: null,
            year: new Date().getFullYear(),
            disclosure_proof: null,
            social_assistant_opinion: null,
            final_result: null
        }
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleModal = () => {
        setIsModalOpen(prev => !prev)
        reset()
    }
    const years = useMemo(() => {
        const currYear = new Date().getFullYear()
        return Array.from({ length: 4 }).map((_, i) => currYear - i)
    }, [])

    const handleUpload = async () => {
        const { year, disclosure_proof, social_assistant_opinion, announcement, final_result } = getValues()
        const group = `group_${Date.now()}`
        await handleUploadFile({
            files: [
                { file: announcement, metadata: { document: ENTITY_GROUP_TYPE.ANNOUNCEMENT } },
                ...Array.from(disclosure_proof ?? []).map(file => ({
                    file,
                    metadata: { document: ENTITY_GROUP_TYPE.DISCLOSURE_PROOF }
                })),
                { file: social_assistant_opinion, metadata: { document: ENTITY_GROUP_TYPE.SOCIAL_ASSISTANT_OPINION } },
                { file: final_result, metadata: { document: ENTITY_GROUP_TYPE.FINAL_RESULT } },
            ],
            metadata: {
                type: ENTITY_LEGAL_FILE.ANNOUNCEMENT
            },
            fields: { year },
            type: ENTITY_LEGAL_FILE.ANNOUNCEMENT,
            group
        })
        handleModal()
    }
    const [currYear, setCurrYear] = useState()

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
                <ButtonBase label={'Novo'} onClick={handleModal} />
            </div>
            <strong>
                Editais, documentos que comprovam sua divulgação, análise do perfil socioeconômico e extrato final de cada processo seletivo.
            </strong>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                {years.map(x => <ButtonBase label={x} onClick={() => setCurrYear(x)} />)}
            </div>

            <GroupedDocumentsGrid
                order={[
                    ENTITY_GROUP_TYPE.ANNOUNCEMENT,
                    ENTITY_GROUP_TYPE.DISCLOSURE_PROOF,
                    ENTITY_GROUP_TYPE.SOCIAL_ASSISTANT_OPINION,
                    ENTITY_GROUP_TYPE.FINAL_RESULT,
                ]}
                documents={documents.filter(c => c.fields.year === currYear)}
                render={(docs, groupId, type) => {
                    return (<div style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: 'center' }}>
                        <div style={{ display: "flex", alignItems: 'center', gap: '4px' }}>
                            {ENTITY_GROUP_TYPE_MAPPER[type]}
                            {docs.length === 1 &&
                                <CustomFilePicker
                                    onUpload={async (files) => {
                                        await handleUpdateFile({
                                            id: docs[0].id,
                                            files,
                                        })
                                    }}
                                >
                                    <Edit width={20} height={20} />
                                </CustomFilePicker>}
                        </div>
                        {docs.length === 0
                            ? <CustomFilePicker
                                onUpload={async (files) => {
                                    await handleUploadFile({
                                        files,
                                        metadata: {
                                            type: ENTITY_LEGAL_FILE.ANNOUNCEMENT,
                                            document: type
                                        },
                                        type: ENTITY_LEGAL_FILE.ANNOUNCEMENT,
                                    }, groupId)
                                }}
                                multiple={type === ENTITY_GROUP_TYPE.DISCLOSURE_PROOF}
                            >
                                <strong>Adicionar</strong>
                            </CustomFilePicker>
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
                onCancel={handleModal}
                onConfirm={handleSubmit(handleUpload)}
            >
                <FormFilePicker control={control} name={'announcement'} label={'Edital'} accept={'application/pdf'} />
                <FormSelect control={control} name={'year'} label={'Ano'} options={years.map(x => ({ label: x, value: x }))} value={watch('year')} />
                <FormFilePicker control={control} name={'disclosure_proof'} label={'Comprovante(s) de divulgação'} multiple accept={'application/pdf'} />
                <FormFilePicker control={control} name={'social_assistant_opinion'} label={'pareceres da assistente social'} accept={'application/pdf'} />
                <FormFilePicker control={control} name={'final_result'} label={'extrato final'} accept={'application/pdf'} />
                {errors?.[''] && errors?.[''].message}
            </Modal>
        </div>
    )
}