import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import entityService from "services/entity/entityService"
import formatDate from "utils/format-date"

export default function EntityApplicants() {
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setIsLoading(true)
                // get all announcements (do not depends on filter)
                const information = await entityService.getFilteredAnnouncements()
                setAnnouncements(information)
            } catch (err) {
            }
            setIsLoading(false)
        }
        fetchAnnouncements()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <h1 style={{ marginBottom: '24px' }}>Matriculados</h1>
            <Table.Root headers={['edital', 'total de vagas', 'vigência', 'ação']}>
                {announcements?.map(e => (
                    <Table.Row key={e.id}>
                        <Table.Cell>{e.announcementName}</Table.Cell>
                        <Table.Cell>{e.verifiedScholarships}</Table.Cell>
                        <Table.Cell>{formatDate(e.announcementDate)}</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'visualizar'} onClick={() => navigate(e.id)} />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Root>
        </>
    )
}