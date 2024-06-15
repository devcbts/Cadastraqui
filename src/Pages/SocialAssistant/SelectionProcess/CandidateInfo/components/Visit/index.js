import Table from "Components/Table";
import styles from '../../styles.module.scss'
import UploadButton from "../UploadButton";
export default function Visit() {
    return (
        <div className={styles.table}>
            <h3>Relatório da visita domiciliar</h3>
            <Table.Root headers={['data', 'relatório da visita domiciliar', '']}>
                <Table.Row>
                    <Table.Cell divider>
                    </Table.Cell>
                    <Table.Cell> </Table.Cell>
                    <Table.Cell>
                        <UploadButton />
                    </Table.Cell>
                </Table.Row>

            </Table.Root>
        </div>
    )
}