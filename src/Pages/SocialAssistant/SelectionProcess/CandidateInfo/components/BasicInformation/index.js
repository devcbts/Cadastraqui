import Table from "Components/Table";
import styles from '../../styles.module.scss'
export default function BasicInformation({
    data
}) {
    return (
        <div className={styles.table}>
            <h3>Quadro sintético do candidato</h3>
            <Table.Root headers={['inscrição', 'nome completo', 'CPF', 'idade', 'ocupação', 'renda média', 'possui CNPJ?']}>
                <Table.Row>
                    <Table.Cell>{data.number}</Table.Cell>
                    <Table.Cell>{data.name}</Table.Cell>
                    <Table.Cell>{data.cpf}</Table.Cell>
                    <Table.Cell>{data.age}</Table.Cell>
                    <Table.Cell>{data.profession}</Table.Cell>
                    <Table.Cell>{data.averageIncome}</Table.Cell>
                    <Table.Cell>Não</Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}