import styles from './styles.module.scss'
import { ReactComponent as Siren } from '../../../Assets/icons/siren.svg'
import Card from 'Components/Card'
import Table from 'Components/Table'
import ButtonBase from 'Components/ButtonBase'
import BackPageTitle from 'Components/BackPageTitle'
import { useNavigate } from 'react-router'
export default function AnnouncementCandidate() {
    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <BackPageTitle title={"Editais do candidato"} path={"/home"} />

                <Card.Root width={'30%'}>
                    <Card.Header>
                        <Siren />
                        <h1>Atenção</h1>
                    </Card.Header>
                    <Card.Content>
                        A bolsa de estudos terá validade para o ano letivo de {2024},
                        com a renovação anual através de seleção. A concessão
                        de bolsa de estudo estará sujeita à disponibilidade de vagas
                        na unidade escolar solicitada e ao perfil socioeconômico
                        compatível às exigências da Lei Complementar nº 187/2021.
                    </Card.Content>
                </Card.Root>
            </div>
            <div>
                <span>Editais em andamento</span>
                <Table.Root headers={["#", "entidade", "edital", "vagas", "ações"]}>
                    <Table.Row>
                        <Table.Cell divider>Teste</Table.Cell>
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'teste'} onClick={() => navigate('123123')}></ButtonBase>
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </div>
    )
}