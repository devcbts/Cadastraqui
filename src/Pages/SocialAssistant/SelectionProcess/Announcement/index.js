import BackPageTitle from "Components/BackPageTitle";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import { ReactComponent as List } from 'Assets/icons/list.svg'
import { useNavigate } from "react-router";
export default function SocialAssistantAnnouncement() {
    const navigate = useNavigate()
    return (
        <>
            <BackPageTitle title={'processo de seleção'} path={'/home'} />
            <div className={styles.informative}>
                <div className={styles.row}>
                    <span>Instituição: Unifei</span>
                    <span>Edital: 1/2024</span>
                    <span>Total de vagas: 200</span>
                </div>
                <span>Vigência do Edital: 31/12/2024</span>
                <span>Período de Inscrição: 01/05/2024 à 20/05/2024</span>
                <span>Período de Avaliação: 21/05/2024 à 20/06/2024</span>
            </div>
            <Table.Root headers={['matriz ou filial/cidade', 'tipo de educação', 'ciclo/ano/série/curso', 'turno', 'concluído?', 'ação', 'rel. fim']}>
                <Table.Row>
                    <Table.Cell>Unifei/itajubá cidade dos sonhos de todos trabalhadores</Table.Cell>
                    <Table.Cell>Superior</Table.Cell>
                    <Table.Cell>1º período</Table.Cell>
                    <Table.Cell>Noturno</Table.Cell>
                    <Table.Cell>Não</Table.Cell>
                    <Table.Cell>
                        <ButtonBase onClick={() => navigate('candidatos')}>
                            <Magnifier width={14} height={14} />
                        </ButtonBase>
                    </Table.Cell>
                    <Table.Cell>
                        <ButtonBase>
                            <List width={14} height={14} />
                        </ButtonBase>
                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </>
    )
}