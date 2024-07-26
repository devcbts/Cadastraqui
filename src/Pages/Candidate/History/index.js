import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import candidateService from "services/candidate/candidateService"
import APPLICATION_STATUS from "utils/enums/application-status"
import findLabel from "utils/enums/helpers/findLabel"

export default function CandidateHistory() {
    const [applications, setApplications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getApplications()
                setApplications(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchApplications()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Histórico</h1>
            <div style={{ padding: '24px' }}>
                <Table.Root headers={['candidato', 'edital', 'entidade', 'status', 'ação']}>
                    {
                        applications.map(e => (
                            <Table.Row>
                                <Table.Cell>{e.candidate.name}</Table.Cell>
                                <Table.Cell>{e.announcement.announcementName}</Table.Cell>
                                <Table.Cell>{e.announcement.entity.name}</Table.Cell>
                                <Table.Cell>{findLabel(APPLICATION_STATUS, e.status)}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase label={'visualizar'} onClick={() => navigate(e.id)} />
                                </Table.Cell>

                            </Table.Row>
                        ))
                    }
                </Table.Root>
            </div>
        </>
    )
}