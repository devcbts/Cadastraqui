import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import entityService from "services/entity/entityService"
import formatDate from "utils/format-date"

export default function EntityAnnouncement() {
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchAnnoucnements = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getOpenAnnouncements()
                setAnnouncements(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchAnnoucnements()
    }, [])
    return (
        <div>
            <Loader loading={isLoading} />
            <h1>Editais</h1>
            <div>
                <h3>Editais abertos</h3>
                <Table.Root headers={['edital', 'total de vagas', 'vigência', 'ações']}>
                    {
                        announcements.map((announcement) => (
                            <Table.Row>
                                <Table.Cell>{announcement.announcementName}</Table.Cell>
                                <Table.Cell>{announcement.verifiedScholarships}</Table.Cell>
                                <Table.Cell>{formatDate(announcement.announcementDate)}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase label={'visualizar'} onClick={() => navigate(announcement.id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Root>
            </div>
        </div>
    )
}