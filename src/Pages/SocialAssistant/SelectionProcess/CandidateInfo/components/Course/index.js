import Table from "Components/Table";
import styles from '../../styles.module.scss'
export default function Course({ data }) {
    return (
        <div className={styles.table}>
            <h3>Curso pretendido</h3>
            <Table.Root headers={['edital', 'instituição', 'cidade', 'curso', 'turno']}>
                <Table.Row>
                    <Table.Cell>{data?.announcement}</Table.Cell>
                    <Table.Cell>{data?.entity}</Table.Cell>
                    <Table.Cell>{data?.city}</Table.Cell>
                    <Table.Cell>{data?.course}</Table.Cell>
                    <Table.Cell>{data?.shift}</Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}