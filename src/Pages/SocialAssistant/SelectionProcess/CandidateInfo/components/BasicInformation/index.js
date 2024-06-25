import Table from "Components/Table";
import styles from '../../styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import formatMoney from "utils/format-money";
export default function BasicInformation({
    data,
    onSearch
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
                    <Table.Cell>{formatMoney(data.income)}</Table.Cell>
                    <Table.Cell>
                        {data.hasCompany === null
                            ? <ButtonBase onClick={onSearch}>
                                <Magnifier width={10} height={10} />
                            </ButtonBase>
                            : (data.hasCompany ? 'Sim' : 'Não')
                        }
                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}