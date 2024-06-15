import Table from "Components/Table";
import styles from '../../styles.module.scss'
import UploadButton from "../UploadButton";
import NewReport from "../NewReport";
import { useState } from "react";
export default function Interview() {
    const [openModal, setOpenModal] = useState(false)
    return (
        <div className={styles.table}>
            <NewReport open={openModal} onClose={() => setOpenModal(false)} />
            <h3>Relatório da Entrevista</h3>
            <Table.Root headers={['data', 'relatório da entrevista', '']}>
                <Table.Row>
                    <Table.Cell divider>
                        22/11/2024
                    </Table.Cell>
                    <Table.Cell> </Table.Cell>
                    <Table.Cell>
                        <UploadButton onClick={() => setOpenModal(true)} />
                    </Table.Cell>
                </Table.Row>

            </Table.Root>
        </div>
    )
}