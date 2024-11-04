import ButtonBase from "Components/ButtonBase"
import DataTable from "Components/DataTable"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import entityService from "services/entity/entityService"
import formatDate from "utils/format-date"

export default function EntityApplicants() {
    const [announcements, setAnnouncements] = useState({
        announcements: [],
        total: 0,
        entity: null
    })
    // const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const fetchAnnouncements = async (page, items, search) => {
        try {
            // setIsLoading(true)
            // get all announcements (do not depends on filter)
            const information = await entityService.getFilteredAnnouncements({
                page, items, name: search
            })
            setAnnouncements(information)
        } catch (err) {
            console.log(err)
        }
        // setIsLoading(false)
    }
    useEffect(() => {
        fetchAnnouncements()
    }, [])
    return (
        <>
            {/* <Loader loading={isLoading} /> */}
            <h1 style={{ marginBottom: '24px' }}>Matriculados</h1>
            <DataTable
                allowPagination
                serverSide
                onDataRequest={async (index, count, value, name) => {
                    fetchAnnouncements(index, count, value)
                }}
                columns={[
                    {
                        accessorKey: 'announcementName',
                        header: 'Edital',
                        cell: (info) => info.getValue(),
                        meta: { cellAlign: 'left', filterKey: 'name' }
                    },
                    {
                        accessorKey: 'verifiedScholarships',
                        header: 'Vagas',
                        enableColumnFilter: false,
                        cell: (info) => info.getValue()
                    },
                    {
                        accessorKey: 'announcementDate',
                        header: 'Vigência',
                        enableColumnFilter: false,
                        cell: (info) => formatDate(info.getValue())
                    },
                    {
                        accessor: 'actions',
                        header: 'Ações',
                        cell: ({ row }) => <ButtonBase label={'visualizar'} onClick={() => navigate(row.original.id)} />
                    }

                ]}
                data={announcements.announcements}
                totalItems={announcements.total}
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