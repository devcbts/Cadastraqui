import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import candidateService from "services/candidate/candidateService";

export default function CandidateRequest() {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getCandidateSolicitations()
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    return (
        <div>
            <Loader loading={isLoading} />
            <h1>Solicitações</h1>
            <h3>Candidaturas</h3>
            <Table.Root headers={['inscrição', 'nome completo', 'entidade', 'edital', 'pendências', 'status', 'ações']}>
                {data?.map((request) => {
                    return (
                        <Table.Row>
                            <Table.Cell>{request.number}</Table.Cell>
                            <Table.Cell>{request.name}</Table.Cell>
                            <Table.Cell>{request.entidade}</Table.Cell>
                            <Table.Cell>{request.announcement}</Table.Cell>
                            <Table.Cell>{request.pendencias}</Table.Cell>
                            <Table.Cell>{request.status}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate(request.id)} />
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Root>
        </div>
    )
}