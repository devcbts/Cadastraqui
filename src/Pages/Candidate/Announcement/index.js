import styles from './styles.module.scss'
import { ReactComponent as Siren } from '../../../Assets/icons/siren.svg'
import Card from 'Components/Card'
import Table from 'Components/Table'
import ButtonBase from 'Components/ButtonBase'
import BackPageTitle from 'Components/BackPageTitle'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import candidateService from 'services/candidate/candidateService'
import Loader from 'Components/Loader'
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
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Loader loading={isLoading} />
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
                <Table.Root headers={["entidade", "edital", "vagas", "ações"]}>
                    {
                        announcements.map((item) => {
                            const { announcement } = item
                            return (
                                <Table.Row>
                                    {/* <Table.Cell divider>Teste</Table.Cell> */}
                                    <Table.Cell>{announcement.entity?.name}</Table.Cell>
                                    <Table.Cell>{announcement.announcementNumber}</Table.Cell>
                                    <Table.Cell>{announcement.offeredVacancies}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => navigate(announcement.id)}></ButtonBase>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }

                </Table.Root>
            </div>
        </div>
    )
}