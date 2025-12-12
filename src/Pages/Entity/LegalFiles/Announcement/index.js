import { pdf } from "@react-pdf/renderer"
import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import FormSelect from "Components/FormSelect"
import Spinner from "Components/Loader/Spinner"
import Modal from "Components/Modal"
import useControlForm from "hooks/useControlForm"
import { useEffect, useMemo, useState } from "react"
import entityService from "services/entity/entityService"
import { ENTITY_GROUP_TYPE } from "utils/enums/entity-group-document-type"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import { z } from "zod"
import GroupedDocumentsGrid from "../GroupedDocumentsGrid"
import DefaultCard from '../GroupedDocumentsGrid/DefaultCard'
import { useLegalFiles } from "../useLegalFiles"
import YearGrid from '../YearGrid'
import FinalResultPdf from "./FinalResultPdf"
export default function Announcement() {
    const { loading, documents, handleUploadFile, handleUpdateFile } = useLegalFiles({ type: 'ANNOUNCEMENT' })
    const { control, watch, handleSubmit, reset, getValues, formState: { errors } } = useControlForm({
        schema: z.object({
            id: z.string().min(1, 'Selecione o edital'),
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
            id: '',
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
        const { year, disclosure_proof, social_assistant_opinion, announcement, final_result, id } = getValues()
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
            fields: { year, id, name: announcements.find(x => x.id === id).announcementName },
            type: ENTITY_LEGAL_FILE.ANNOUNCEMENT,
            group
        })
        handleModal()
    }
    const [currYear, setCurrYear] = useState()
    const [announcements, setAnnouncements] = useState([])
    useEffect(() => {
        const fetch = async () => {
            try {
                setAnnouncements((await entityService.getFilteredAnnouncements()).announcements)
            } catch { }
        }
        fetch()
    }, [])
    const handleGenerateReport = async (id) => {
        if (!id) {
            return
        }
        const response = await entityService.getAnnouncementResume(id)
        const blob = await pdf(<FinalResultPdf data={response} />).toBlob()
        console.log(blob)
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')

    }
    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Spinner size="24" />
            <strong>Carregando documentos da seção</strong>
        </div>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
                <ButtonBase label={'Novo'} onClick={handleModal} />
            </div>
            <strong>
                Editais, documentos que comprovam sua divulgação, análise do perfil socioeconômico e extrato final de cada processo seletivo.
            </strong>
            <YearGrid
                container={{
                    onClick: setCurrYear
                }}
                render={(year) => <strong>{year}</strong>}
            />

            <h1>{currYear}</h1>
            {currYear && <GroupedDocumentsGrid
                order={[
                    ENTITY_GROUP_TYPE.ANNOUNCEMENT,
                    ENTITY_GROUP_TYPE.DISCLOSURE_PROOF,
                    ENTITY_GROUP_TYPE.SOCIAL_ASSISTANT_OPINION,
                    ENTITY_GROUP_TYPE.FINAL_RESULT,
                ]}
                documents={documents.filter(c => c.fields.year === currYear)}
                render={(docs, groupId, type) => {

                    return (
                        <DefaultCard
                            actions={type === ENTITY_GROUP_TYPE.FINAL_RESULT
                                ? <strong
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleGenerateReport(
                                        documents.find(x => x.group === groupId)?.fields?.id
                                    )}>Gerar relatório</strong>

                                : null
                            }
                            docs={docs}
                            type={type}
                            multiple={type === ENTITY_GROUP_TYPE.DISCLOSURE_PROOF}
                            onUpdate={async (id, files) => {
                                await handleUpdateFile({
                                    id,
                                    files,
                                })
                            }}
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
                        />
                    )
                }
                }
                separator
            />}
            <Modal open={isModalOpen}
                onClose={handleModal}
                onConfirm={handleSubmit(handleUpload)}
            >
                <FormSelect control={control} name={'id'} label={'Edital'}
                    value={watch('id')}
                    options={announcements.map(x => ({ label: x.announcementName, value: x.id }))}
                />
                <FormFilePicker control={control} name={'announcement'} label={'Arquivo do edital'} accept={'application/pdf'} />
                <FormSelect control={control} name={'year'} label={'Ano'} options={years.map(x => ({ label: x, value: x }))} value={watch('year')} />
                <FormFilePicker control={control} name={'disclosure_proof'} label={'Comprovante(s) de divulgação'} multiple accept={'application/pdf'} />
                <FormFilePicker control={control} name={'social_assistant_opinion'} label={'pareceres da assistente social'} accept={'application/pdf'} />
                <FormFilePicker control={control} name={'final_result'} label={'extrato final'} accept={'application/pdf'} />
                {errors?.[''] && errors?.[''].message}
            </Modal>
        </div>
    )
}