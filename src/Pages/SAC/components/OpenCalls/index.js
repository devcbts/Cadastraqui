import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import callService from "services/call/callService";
import { NotificationService } from "services/notification";
import formatDate from "utils/format-date";

export default function OpenCalls() {
    const navigate = useNavigate()
    const [calls, setCalls] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await callService.getOpenCalls()
                setCalls(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    const handleLinkCall = async (id) => {
        try {
            await callService.linkCall({ id })
            navigate(id)
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div>
            <Loader loading={isLoading} />
            <div>
                <h3>Lista de chamados abertos</h3>
                <Table.Root headers={['chamado', 'número', 'abertura', 'status', 'ações']}>
                    {
                        calls.map(e => (
                            <Table.Row key={e.id}>
                                <Table.Cell>{e.callSubject}</Table.Cell>
                                <Table.Cell>{e.number}</Table.Cell>
                                <Table.Cell>{formatDate(e.CreatedAt)}</Table.Cell>
                                <Table.Cell>{e.status}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase label={'vincular'} onClick={() => handleLinkCall(e.id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Root>
            </div>
        </div>
    )
}