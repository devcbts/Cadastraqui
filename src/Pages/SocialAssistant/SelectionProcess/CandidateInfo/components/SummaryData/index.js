import Table from "Components/Table";
import styles from '../../styles.module.scss'
import findLabel from "utils/enums/helpers/findLabel";
import PROPERTY_STATUS from "utils/enums/property-status";
import formatMoney from "utils/format-money";
import DataTable from "Components/DataTable";
import Indicator from "Components/Indicator";
import ExpandableTableContent from "Components/DataTable/ExpandableTableContent";
import formatDate from "utils/format-date";
export default function SummaryData({ resume, membersCnpj }) {
    return (
        <div className={styles.table} style={{ gap: '24px' }}>
            <Table.Root
                title={'Resumo de dados relevantes'}
                headers={['cad. único', 'renda média bruta familiar', 'despesas do último mês', 'situação do imóvel', 'quantidade de veículos',]}>
                <Table.Row>
                    <Table.Cell>{resume.cadUnico ? 'Sim' : 'Não'}</Table.Cell>
                    <Table.Cell>{formatMoney(resume.familyIncome)}</Table.Cell>
                    <Table.Cell>{formatMoney(resume.familyExpenses)}</Table.Cell>
                    {/* <Table.Cell>{resume.hasSevereDisease ? 'Sim' : 'Não'}</Table.Cell> */}
                    <Table.Cell>{findLabel(PROPERTY_STATUS, resume.housingSituation)}</Table.Cell>
                    <Table.Cell>{resume.vehiclesCount}</Table.Cell>
                    {/* <Table.Cell>{resume.distance}</Table.Cell> */}
                </Table.Row>
            </Table.Root>
            <DataTable
                title={'CNPJ'}
                data={membersCnpj}
                columns={[
                    { accessorKey: 'name', header: 'Nome completo' },
                    { accessorKey: 'informedCNPJ', header: 'Declarou CNPJ', cell: (info) => info.getValue() ? 'Sim' : 'Não' },
                    { accessorKey: 'CPFCNPJ', header: 'Possui CNPJ', cell: (info) => info.getValue() ? 'Sim' : 'Não' },
                ]}
                expandedContent={(row) => (<ExpandableTableContent focus={false}>
                    {row.original.foundCompanies?.length !== 0 ?
                        <>
                            <strong>CNPJ encontrado(s):</strong>
                            <ul>
                                {row.original.foundCompanies.map(x => (
                                    <li style={{ fontSize: 16, marginTop: 4, }}>{x.name} - {x.CNPJ}. Sócio desde {formatDate(x.date)}. Situação: {x.status}</li>
                                ))}
                            </ul>
                        </>
                        : <strong>Nenhum CNPJ encontrado</strong>
                    }
                </ExpandableTableContent>)}
            />
        </div>
    )
}