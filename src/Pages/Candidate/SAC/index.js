import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import callService from "services/call/callService";
import formatDate from "utils/format-date";

export default function CandidateSAC() {
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
    return (
        <div>
            <Loader loading={isLoading} />
            <h1>SAC</h1>
            <div>
                <h3>Lista de chamados</h3>
                <ButtonBase label={'abrir novo chamado'} onClick={() => navigate('novo')} />
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
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Root>
            </div>
        </div>
    )
}