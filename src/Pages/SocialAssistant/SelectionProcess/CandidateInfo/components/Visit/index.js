import Table from "Components/Table";
import styles from '../../styles.module.scss'
import UploadButton from "../UploadButton";
import NewReport from "../NewReport";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FilePreview from "Components/FilePreview";
import { formatDate } from "utils/get-date-formatted";
import uploadService from "services/upload/uploadService";
import { NotificationService } from "services/notification";
export default function Visit({ data, }) {
    const [openModal, setOpenModal] = useState(false)
    const [report, setReport] = useState()
    const { state } = useLocation()
    const handleSubmit = async (values) => {
        try {
            const formData = new FormData()
            formData.append(`visita-${values.date}`, values.file)
            await uploadService.uploadSolicitation({ applicationId: state?.applicationId, type: "Visit" }, formData)
            setReport({ ...values, submitFile: values.file })
            NotificationService.success({ text: 'Relatório da visita salvo' })
        } catch (err) {
            NotificationService.error({ text: 'Falha ao realizar upload do documento' })
        }
        // onSubmit(values)
    }
    useEffect(() => {
        setReport(data)
    }, [data])
    return (
        <div className={styles.table}>
            <NewReport open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />

            <h3>Relatório da visita domiciliar</h3>
            <Table.Root headers={['data', 'relatório da visita domiciliar', '']}>
                <Table.Row>
                    <Table.Cell divider>
                        {report?.date ? formatDate(report?.date) : '-'}
                    </Table.Cell>
                    <Table.Cell>
                        Se houver, registre o relatório da visita domiciliar realizada
                    </Table.Cell>
                    <Table.Cell>
                        {report?.file
                            ? <FilePreview file={report.submitFile} url={report.file} text={'visualizar documento'} />
                            : <UploadButton onClick={() => setOpenModal(true)} />
                        }
                    </Table.Cell>
                </Table.Row>

            </Table.Root>
        </div>
    )
}