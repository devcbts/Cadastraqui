import Table from "Components/Table";
import styles from '../../styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import formatMoney from "utils/format-money";
export default function BasicInformation({
    title,
    isCandidate = true,
    data,
}) {
    const headers = ['inscrição', 'nome completo', 'CPF', 'idade', 'ocupação', 'renda média',]
    return (
        <div className={styles.table}>
            <h3>{title}</h3>
            <Table.Root headers={headers.filter(e => {
                if (!isCandidate) {
                    return e != 'inscrição'
                }
                return e
            })}>
                <Table.Row>
                    {isCandidate && <Table.Cell>{data?.number}</Table.Cell>}
                    <Table.Cell>{data?.name}</Table.Cell>
                    <Table.Cell>{data?.cpf}</Table.Cell>
                    <Table.Cell>{data?.age}</Table.Cell>
                    <Table.Cell>{data?.profession}</Table.Cell>
                    <Table.Cell>{formatMoney(data?.income)}</Table.Cell>

                </Table.Row>
            </Table.Root>
        </div>
    )
}