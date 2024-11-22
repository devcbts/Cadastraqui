import ButtonBase from "Components/ButtonBase"
import DataTable from "Components/DataTable"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import entityService from "services/entity/entityService"
import formatDate from "utils/format-date"

export default function EntityApplicants() {
    const [data, setData] = useState({
        announcements: [],
        total: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const fetchAnnouncements = async ({ page, size } = {}) => {
        try {
            setIsLoading(true)
            // get all announcements (do not depends on filter)
            const information = await entityService.getFilteredAnnouncements({ page, size })
            setData(information)
        } catch (err) {
        }
        setIsLoading(false)
    }
    // useEffect(() => {
    //     fetchAnnouncements()
    // }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <h1 style={{ marginBottom: '24px' }}>Matriculados</h1>
            <DataTable
                data={data.announcements}
                totalItems={data.total}
                serverSide
                allowPagination
                onDataRequest={(index, count) => fetchAnnouncements({ page: index, size: count })}
                columns={[
                    { accessorKey: 'announcementName', header: 'Edital', meta: { cellAlign: 'start' } },
                    { accessorKey: 'verifiedScholarships', header: 'Total de vagas' },
                    { accessorKey: 'announcementDate', header: 'Vigência', cell: ({ row: { original } }) => formatDate(original.announcementDate) },
                    {
                        id: 'action', header: 'Ações', cell: ({ row: { original } }) => <ButtonBase label={'visualizar'} onClick={() => navigate(original.id)} />
                    },
                ]}
            />
            {/* <Table.Root headers={['edital', 'total de vagas', 'vigência', 'ação']}>
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
            </Table.Root> */}
        </>
    )
}