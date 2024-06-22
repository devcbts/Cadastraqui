import Table from "Components/Table";
import styles from '../../styles.module.scss'
import UploadButton from "../UploadButton";
import NewReport from "../NewReport";
import { useEffect, useState } from "react";
import formatDate from "utils/format-date";
import FilePreview from "Components/FilePreview";
export default function Interview({ data, onSubmit }) {
    const [openModal, setOpenModal] = useState(false)
    const [report, setReport] = useState()
    const handleSubmit = (values) => {
        setReport(values)
        onSubmit(values)
    }
    useEffect(() => {
        setReport(data)
    }, [data])
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
                    </Table.Cell>
                    <Table.Cell>
                        {report?.file
                            ? <FilePreview url={report.file} text={'visualizar documento'} />
                            : <UploadButton onClick={() => setOpenModal(true)} />
                        }
                    </Table.Cell>
                </Table.Row>

            </Table.Root>
        </div>
    )
}