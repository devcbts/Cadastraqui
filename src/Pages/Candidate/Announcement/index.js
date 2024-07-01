import BackPageTitle from 'Components/BackPageTitle'
import ButtonBase from 'Components/ButtonBase'
import Loader from 'Components/Loader'
import Table from 'Components/Table'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import candidateService from 'services/candidate/candidateService'
import { ReactComponent as Siren } from '../../../Assets/icons/siren.svg'
import { CardContent, CardHead, CardRoot, CardTitle, Container, Header, TitlePage } from './styles.ts'
export default function AnnouncementCandidate() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [announcements, setAnnouncements] = useState([])
    useEffect(() => {
        const fetchAnnouncement = async () => {
            setIsLoading(true)
            try {
                const information = await candidateService.getCandidateAnnouncements()
                setAnnouncements(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchAnnouncement()
    }, [])
    const currentYear = new Date().getFullYear()
    return (
        <Container>
            <Header>
                <Loader loading={isLoading} />
                <TitlePage>
                    <BackPageTitle title={"Editais do candidato"} path={"/home"} />
                </TitlePage>
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
            </Header>
            <div>
                <span>Editais em andamento</span>
                <Table.Root headers={["entidade", "edital", "vagas", "ações"]}>
                    {
                        announcements.map((item) => {
                            const { announcement } = item
                            return (
                                <Table.Row>
                                    {/* <Table.Cell divider>Teste</Table.Cell> */}
                                    <Table.Cell>{announcement.entity?.socialReason}</Table.Cell>
                                    <Table.Cell>{announcement.announcementNumber}</Table.Cell>
                                    <Table.Cell>{announcement.verifiedScholarships}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => navigate(announcement.id)}></ButtonBase>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }

                </Table.Root>
            </div>
        </Container>
    )
}