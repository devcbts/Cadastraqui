import Table from 'Components/Table'
import styles from '../../styles.module.scss'
import DISEASES from 'utils/enums/diseases'
export default function Health({ data }) {
    return (
        <div className={styles.table}>
            <h3>Saúde</h3>
            <Table.Root headers={['nome completo', 'doença', 'remédio controlado', 'obtém pela rede pública?']}>
                {
                    data?.map((item) => {
                        return (<Table.Row>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{DISEASES.find(e => e.value === item.disease)?.label ?? '-'}</Table.Cell>
                            <Table.Cell>{item.medication?.[0]?.name ?? '-'}</Table.Cell>
                            <Table.Cell>{item.medication?.[0]?.obtainedPublicy === null ? '-' : (item.medication?.[0]?.obtainedPublicy ? 'Sim' : 'Não')}</Table.Cell>
                        </Table.Row>)
                    })
                }
            </Table.Root>
        </div>
    )
}