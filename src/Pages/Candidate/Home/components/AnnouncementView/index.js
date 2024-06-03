import styles from './styles.module.scss'
import { ReactComponent as Arrow } from '../../../../../Assets/icons/arrow.svg'
import { useNavigate } from 'react-router'
import { ReactComponent as Siren } from '../../../../../Assets/icons/siren.svg'
import Card from 'Components/Card'
import Table from 'Components/Table'
import ButtonBase from 'Components/ButtonBase'
export default function AnnouncementView() {
    const navigate = useNavigate()
    const actualYear = new Date().getFullYear();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <Arrow height={15} style={{ transform: "rotateZ(180deg)" }} onClick={() => navigate('/home')} />
                    <h1>Editais do candidato</h1>
                </div>
                <Card.Root width={'30%'}>
                    <Card.Header>
                        <Siren />
                        <h1>Atenção</h1>
                    </Card.Header>
                    <Card.Content>
                        A bolsa de estudos terá validade para o ano letivo de {actualYear},
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
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>Teste</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'teste'}></ButtonBase>
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </div>
    )
}