import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import SelectBase from "Components/SelectBase"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import entityService from "services/entity/entityService"
import formatDate from "utils/format-date"
import styles from './styles.module.scss'
import DataTable from "Components/DataTable"
export default function EntityAnnouncement() {
    const [data, setData] = useState({
        announcements: [],
        total: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [filter, setFilter] = useState({ value: 'open', label: 'Vigentes' })
    const filterTypes = [
        { value: 'scheduled', label: 'Pré-agendados' },
        { value: 'open', label: 'Vigentes' },
        { value: 'subscription', label: 'Fase de inscrição' },
        { value: 'finished', label: 'Finalizados' },
    ]
    const fetchAnnoucnements = async ({ page, size, search, type } = {}) => {
        try {
            setIsLoading(true)
            const information = await entityService.getFilteredAnnouncements({ filter: filter.value, page, size, search, type })
            setData(information)
        } catch (err) { }
        setIsLoading(false)
    }
    // useEffect(() => {
    //     fetchAnnoucnements()
    // }, [filter])
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Editais</h1>
            <div className={styles.selection}>
                <h3>Filtrar por</h3>
                <SelectBase options={filterTypes} value={filter} onChange={e => setFilter(e)} error={null} />
            </div>
            <DataTable
                key={filter.value}
                data={data.announcements}
                totalItems={data.total}
                serverSide
                allowPagination
                onDataRequest={(index, count, value, name) => fetchAnnoucnements({ page: index, size: count, search: value, type: name })}
                enableFilters
                columns={[
                    { accessorKey: 'announcementName', header: 'Edital', meta: { cellAlign: 'start', filterKey: 'edital' }, },
                    { accessorKey: 'verifiedScholarships', header: 'Total de vagas', enableColumnFilter: false },
                    { accessorKey: 'announcementDate', header: 'Vigência', cell: ({ row: { original } }) => formatDate(original.announcementDate), enableColumnFilter: false },
                    {
                        id: 'action', header: 'Ações', cell: ({ row: { original } }) => <ButtonBase label={'visualizar'} onClick={() => navigate(original.id)} />
                    },
                ]}
            />
            {/* <Table.Root headers={['edital', 'total de vagas', 'vigência', 'ações']}>
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
                </Table.Root> */}
        </>
    )
}