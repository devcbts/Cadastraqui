import Table from 'Components/Table'
import styles from '../../styles.module.scss'
import FAMILY_RELATIONSHIP from 'utils/enums/family-relationship'
import formatMoney from 'utils/format-money'
export default function FamilyGroup({ data }) {
    return (
        <div className={styles.table}>
            <h3>Integrantes do grupo familiar</h3>
            <Table.Root headers={['nome', 'CPF', 'idade', 'ocupação', 'parentesco', 'renda média']}>
                {
                    data.map((familyMember) => (
                        <Table.Row>
                            <Table.Cell>{familyMember.name}</Table.Cell>
                            <Table.Cell>{familyMember.cpf}</Table.Cell>
                            <Table.Cell>{familyMember.age}</Table.Cell>
                            <Table.Cell>{familyMember.profession}</Table.Cell>
                            <Table.Cell>{FAMILY_RELATIONSHIP.find(e => e.value === familyMember.relationship)?.label}</Table.Cell>
                            <Table.Cell>{formatMoney(familyMember.income)}</Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}