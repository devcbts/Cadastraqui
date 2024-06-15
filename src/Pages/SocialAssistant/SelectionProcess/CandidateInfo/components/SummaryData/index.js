import Table from "Components/Table";
import styles from '../../styles.module.scss'
export default function SummaryData({ data }) {
    return (
        <div className={styles.table}>
            <h3>Resumo de dados relevantes</h3>
            <Table.Root headers={['cad. único', 'renda média bruta familiar', 'médias das despesas familiar', 'doença grave', 'situação do imóvel', 'quantidade de veículos', 'distância da residência']}>
                <Table.Row>
                    <Table.Cell>{data.cadUnico ? 'Sim' : 'Não'}</Table.Cell>
                    <Table.Cell>{data.familyIncome}</Table.Cell>
                    <Table.Cell>{data.familyExpenses}</Table.Cell>
                    <Table.Cell>{data.hasSevereDisease ? 'Sim' : 'Não'}</Table.Cell>
                    <Table.Cell>{data.housingSituation}</Table.Cell>
                    <Table.Cell>{data.vehiclesCount}</Table.Cell>
                    <Table.Cell>{data.distance}</Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}