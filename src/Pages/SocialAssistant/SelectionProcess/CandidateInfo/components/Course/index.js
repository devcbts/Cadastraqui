import Table from "Components/Table";
import styles from '../../styles.module.scss'
export default function Course() {
    return (
        <div className={styles.table}>
            <h3>Curso pretendido</h3>
            <Table.Root headers={['edital', 'instituição', 'cidade', 'curso', 'turno']}>
                <Table.Row>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}