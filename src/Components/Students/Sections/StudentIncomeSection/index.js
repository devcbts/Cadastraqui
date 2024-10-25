import Table from 'Components/Table'
import styles from '../styles.module.scss'
import InputBase from 'Components/InputBase'
export default function StudentIncomeSection({
    income,
    family
}) {
    const incomeFields = [
        { field: "averageIncome", label: 'Renda média familiar' },
        { field: "expenses", label: 'Despesas' },
        { field: "status", label: 'Status da renda' },
    ]
    return (
        <div className={styles.information}>
            <h2 className={styles.title}>Dados socioeconômicos</h2>
            {Object.entries(income ?? {}).map(([k, v]) => {
                const currField = incomeFields.find(e => k === e.field)
                if (!currField) { return null }
                return (
                    <div className={styles.content}>
                        <h4 className={styles.titleinput}>{currField.label}</h4>
                        <InputBase error={null} value={v} key={k} disabled />
                    </div>
                )
            })}

            <Table.Root headers={2} title={'Grupo familiar'}>
                {family?.map((e, i) => (
                    <Table.Row key={i}>
                        <Table.Cell divider>{++i}</Table.Cell>
                        <Table.Cell>{e.fullName}</Table.Cell>
                    </Table.Row>

                ))}
            </Table.Root>

        </div>
    )
}