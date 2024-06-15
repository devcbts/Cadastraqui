import Table from 'Components/Table'
import styles from '../../styles.module.scss'
import DISEASES from 'utils/enums/diseases'
export default function Health({ data }) {
    return (
        <div className={styles.table}>
            <h3>Saúde</h3>
            <Table.Root headers={['nome completo', 'doença', 'remédio controlado', 'obtém pela rede pública?']}>
                {
                    data?.medication?.map((medication) => {
                        return (<Table.Row>
                            <Table.Cell>{data.name}</Table.Cell>
                            <Table.Cell>{DISEASES.find(e => e.value === data.disease)?.label}</Table.Cell>
                            <Table.Cell>{medication.name}</Table.Cell>
                            <Table.Cell>{medication.obtainedPublicy}</Table.Cell>
                        </Table.Row>)
                    })
                }
            </Table.Root>
        </div>
    )
}