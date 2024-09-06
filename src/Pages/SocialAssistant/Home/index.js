import Card from "Components/Card";
import Loader from "Components/Loader";
import { useEffect, useState } from "react";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function AssistantHome() {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getDashboard()
                setData(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchDashboard()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Início</h1>
            <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                justifyContent: 'center', gap: '24px', padding: '32px 64px', placeSelf: "center"
            }}>
                <Card.Root>
                    <Card.Title text={'meus editais'} />
                    <Card.Content> {data?.allAnnouncements}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'editais - fase de inscrição'} />
                    <Card.Content> {data?.applicationAnnouncements}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'editais - fase de avaliação'} />
                    <Card.Content> {data?.avaliationAnnouncements}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'editais - finalizados'} />
                    <Card.Content> {data?.closedAnnoncements}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'alunos em avaliação'} />
                    <Card.Content> {data?.pendingApplications}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'solicitações feitas'} />
                    <Card.Content> {data?.numberOfRequests}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'solicitações atendidas'} />
                    <Card.Content> {data?.resolvedRequests}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'alunos aprovados'} />
                    <Card.Content> {data?.approvedApplications}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'agendamentos marcados'} />
                    <Card.Content> {data?.allInterviews}</Card.Content>
                </Card.Root>
                <Card.Root >
                    <Card.Title text={'agendamentos do dia'} />
                    <Card.Content> {data?.todayInterviews}</Card.Content>
                </Card.Root>
            </div >
        </>
    )
}