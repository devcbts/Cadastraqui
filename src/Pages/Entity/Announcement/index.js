import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import SelectBase from "Components/SelectBase"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import entityService from "services/entity/entityService"
import formatDate from "utils/format-date"
import styles from './styles.module.scss'
export default function EntityAnnouncement() {
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [filter, setFilter] = useState({ value: 'open', label: 'Vigentes' })
    const filterTypes = [
        { value: 'scheduled', label: 'Pré-agendados' },
        { value: 'open', label: 'Vigentes' },
        { value: 'subscription', label: 'Fase de inscrição' },
        { value: 'finished', label: 'Finalizados' },
    ]
    useEffect(() => {
        const fetchAnnoucnements = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getFilteredAnnouncements({ filter: filter.value })
                setAnnouncements(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchAnnoucnements()
    }, [filter])
    return (
        <div>
            <Loader loading={isLoading} />
            <h1>Editais</h1>
            <div>
                <div className={styles.selection}>
                    <h3>Filtrar por</h3>
                    <SelectBase options={filterTypes} value={filter} onChange={e => setFilter(e)} error={null} />
                </div>
                <Table.Root headers={['edital', 'total de vagas', 'vigência', 'ações']}>
                    {
                        announcements.map((announcement) => (
                            <Table.Row>
                                <Table.Cell align="left">{announcement.announcementName}</Table.Cell>
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