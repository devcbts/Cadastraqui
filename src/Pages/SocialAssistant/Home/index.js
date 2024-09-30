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
                <Card title={'meus editais'} >
                    {data?.allAnnouncements}
                </Card>
                <Card title={'editais - fase de inscrição'}>
                    {data?.applicationAnnouncements}
                </Card>
                <Card title={'editais - fase de avaliação'}>
                    {data?.avaliationAnnouncements}
                </Card>
                <Card title={'editais - finalizados'}>
                    {data?.closedAnnoncements}
                </Card>
                <Card title={'alunos em avaliação'}>
                    {data?.pendingApplications}
                </Card>
                <Card title={'solicitações feitas'}>
                    {data?.numberOfRequests}
                </Card>
                <Card title={'solicitações atendidas'}>
                    {data?.resolvedRequests}
                </Card>
                <Card title={'alunos aprovados'}>
                    {data?.approvedApplications}
                </Card>
                <Card title={'agendamentos marcados'}>
                    {data?.allInterviews}
                </Card>
                <Card title={'agendamentos do dia'}>
                    {data?.todayInterviews}
                </Card>

            </div >
        </>
    )
}