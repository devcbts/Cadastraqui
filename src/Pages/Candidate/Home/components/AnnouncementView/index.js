import ButtonBase from 'Components/ButtonBase';
import Table from 'Components/Table';
import { useNavigate } from 'react-router';
import { ReactComponent as Arrow } from '../../../../../Assets/icons/arrow.svg';
import { ReactComponent as Siren } from '../../../../../Assets/icons/siren.svg';
import styles from './styles.module.scss';
import { CardContent, CardHead, CardRoot, CardTitle } from './styles.ts';
import BackPageTitle from 'Components/BackPageTitle';
export default function AnnouncementView() {
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <BackPageTitle
                    title={'Editais do candidato'}
                    path={'/home'}
                />

                <CardRoot>
                    <CardHead>
                        <Siren />
                        <CardTitle><h1>Atenção</h1></CardTitle>
                    </CardHead>
                    <CardContent>
                        A bolsa de estudos terá validade para o ano letivo de {currentYear},
                        com a renovação anual através de seleção. A concessão
                        de bolsa de estudo estará sujeita à disponibilidade de vagas
                        na unidade escolar solicitada e ao perfil socioeconômico
                        compatível às exigências da Lei Complementar nº 187/2021.
                    </CardContent>
                </CardRoot>
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