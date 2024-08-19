import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import callService from "services/call/callService";
import { NotificationService } from "services/notification";
import formatDate from "utils/format-date";

export default function LinkedCalls() {
    const navigate = useNavigate()
    const [calls, setCalls] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await callService.getUserCalls()
                setCalls(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    const handleFinishCall = async (id) => {
        NotificationService.confirm({
            title: 'Finalizar chamado',
            text: 'Quando finalizado, não poderão ser enviadas novas mensagens',
            onConfirm: async () => {
                try {
                    await callService.finishCall({ id })
                    NotificationService.success({ text: 'Chamado finalizado' })
                    setCalls((prev) => prev.map(call => {
                        return call.id === id ? ({ ...call, status: 'CLOSED' }) : call
                    }))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }

            }
        })
    }
    return (
        <div>
            <Loader loading={isLoading} />
            <div>
                <h3>Meus chamados</h3>
                <Table.Root headers={['chamado', 'número', 'abertura', 'status', 'ações']}>
                    {
                        calls.map(e => (
                            <Table.Row key={e.id}>
                                <Table.Cell>{e.callSubject}</Table.Cell>
                                <Table.Cell>{e.number}</Table.Cell>
                                <Table.Cell>{formatDate(e.CreatedAt)}</Table.Cell>
                                <Table.Cell>{e.status}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase label={'visualizar'} onClick={() => navigate(`${e.id}`)} />
                                    {e.status !== "CLOSED" && <ButtonBase label={'finalizar'} onClick={() => handleFinishCall(e.id)} danger />}
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Root>
            </div>
        </div>
    )
}