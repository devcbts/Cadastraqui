import Table from "Components/Table";
import styles from '../../styles.module.scss'
import UploadButton from "../UploadButton";
import NewReport from "../NewReport";
import { useEffect, useState } from "react";
import formatDate from "utils/format-date";
import FilePreview from "Components/FilePreview";
import { useLocation } from "react-router";
import uploadService from "services/upload/uploadService";
import { NotificationService } from "services/notification";
import ButtonBase from "Components/ButtonBase";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function Interview({ data }) {
    const [openModal, setOpenModal] = useState(false)
    const { state } = useLocation()
    const [report, setReport] = useState()
    const handleSubmit = async (values) => {
        try {
            const formData = new FormData()
            formData.append(`entrevista-${values.date}`, values.file)
            await uploadService.uploadSolicitation({ applicationId: state?.applicationId, type: "Interview" }, formData)
            setReport({ ...values, submitFile: values.file })
            NotificationService.success({ text: 'Relatório da entrevista salvo' })
        } catch (err) {
            NotificationService.error({ text: 'Falha ao realizar upload do documento' })
        }
        // onSubmit(values)
    }
    useEffect(() => {
        setReport(data)
    }, [data])
    const handleRequestInterview = async () => {
        try {
            await socialAssistantService.registerSolicitation(state?.applicationId, {
                type: 'Interview',
                description: 'Agendar entrevista'
            })
            NotificationService.success({ text: 'Solicitação de entrevista enviada' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div className={styles.table}>
            <NewReport open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />
            <h3>Relatório da Entrevista</h3>
            <Table.Root headers={['data', 'relatório da entrevista', '']}>
                <Table.Row>
                    <Table.Cell divider>
                        {report?.date ? formatDate(report?.date) : '-'}
                    </Table.Cell>
                    <Table.Cell>
                        Se houver, registre o relatório da entrevista realizada
                    </Table.Cell>
                    <Table.Cell>
                        {report?.file
                            ? <FilePreview file={report.submitFile} url={report.file} text={'visualizar documento'} />
                            : <UploadButton onClick={() => setOpenModal(true)} />
                        }
                    </Table.Cell>
                </Table.Row>

            </Table.Root>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px' }}>

                <ButtonBase label={'solicitar entrevista'} onClick={handleRequestInterview} />
            </div>
        </div>
    )
}