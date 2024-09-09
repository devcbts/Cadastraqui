import BackPageTitle from "Components/BackPageTitle"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import adminService from "services/admin/adminService"
import { NotificationService } from "services/notification"
import { CALL_STATUS_TRANSLATION } from "utils/enums/call-status"
import formatDate from "utils/format-date"

export default function AdminAccountHistory({ filter }) {
    const { userId } = useParams()
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const isSAC = filter === "sac"

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getAccountHistory(userId, filter)

                setHistory(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        if (userId) fetchHistory()
    }, [userId, filter])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={isSAC ? 'Histórico de Chamados' : 'Histórido de Login'} />
            <Table.Root headers={
                isSAC
                    ? ['Número', 'Abertura', 'Chamado', 'Status']
                    : ['IP', 'Data de acesso']
            }>

                {
                    history?.map((e) => {
                        return isSAC
                            ? (
                                <Table.Row>
                                    <Table.Cell>{e.number}</Table.Cell>
                                    <Table.Cell>{formatDate(e.CreatedAt)}</Table.Cell>
                                    <Table.Cell>{e.callSubject}</Table.Cell>
                                    <Table.Cell>{CALL_STATUS_TRANSLATION[e.status]}</Table.Cell>
                                </Table.Row>

                            )
                            : (
                                <Table.Row>
                                    <Table.Cell>{e.ip}</Table.Cell>
                                    <Table.Cell>{formatDate(e.createdAt, { showTime: true })}</Table.Cell>

                                </Table.Row>
                            )
                    })
                }
            </Table.Root>
        </>
    )
}