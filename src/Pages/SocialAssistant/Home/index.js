import Card from "Components/Card";
import Loader from "Components/Loader";
import GraphCard from "Pages/Students/Dashboard/components/GraphCard";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, Rectangle, PieChart, Pie, Legend } from "recharts";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import toColor from "utils/number-to-color";

export default function AssistantHome() {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
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
    const announcementGraph = useMemo(() => ([
        { value: data?.applicationAnnouncements, label: 'Inscrição' },
        { value: data?.avaliationAnnouncements, label: 'Avaliação' },
        { value: data?.closedAnnoncements, label: 'Fechados' }
    ]), [data])
    const candidateGraph = useMemo(() => {
        if (!data?.candidateInterest) { return [] }
        const {
            numberOfInterested,
            numberOfApplications,
            numberOfFinishedRegistration,
            numberOfUnfinishedRegistration
        } = data?.candidateInterest
        return ([
            { value: numberOfInterested, label: 'Interessados' },
            { value: numberOfApplications, label: 'Inscritos' },
            { value: numberOfFinishedRegistration, label: 'Cadastro completo' },
            { value: numberOfUnfinishedRegistration, label: 'Cadastro incompleto' },
        ])
    }, [data?.candidateInterest])
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Início</h1>
            <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                justifyContent: 'center', gap: '24px', padding: '32px 64px', placeSelf: "center"
            }}>
                <Card title={'meus editais'} onClick={() => navigate('/processos')}>
                    {data?.allAnnouncements}
                </Card>
                {/* <Card title={'editais - fase de inscrição'}>
                    {data?.applicationAnnouncements}
                </Card>
                <Card title={'editais - fase de avaliação'}>
                    {data?.avaliationAnnouncements}
                </Card>
                <Card title={'editais - finalizados'}>
                    {data?.closedAnnoncements}
                </Card> */}
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
                <Card title={'agendamentos marcados'} >
                    {data?.allInterviews}
                </Card>
                <Card title={'agendamentos do dia'} onClick={() => navigate('/agenda', { state: { scheduleView: 'agenda' } })}>
                    {data?.todayInterviews}
                </Card>
            </div >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', }}>

                <GraphCard title={'Meus editais (por fase)'} >
                    <ResponsiveContainer width={"100%"} minHeight={300} >

                        <BarChart data={announcementGraph}>

                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip
                                formatter={(v) => [v, 'Editais']}
                                labelFormatter={(_, payload) => {
                                    return [payload?.[0]?.payload.label]
                                }}
                            />

                            <Bar dataKey="value" activeBar={<Rectangle fill="gold" stroke="black" />} >
                                {
                                    announcementGraph?.map((entry, index) => {
                                        return (
                                            <Cell key={`cell-${index}`} fill={toColor((index + 1) * 255)} />
                                        )
                                    })
                                }
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </GraphCard>
                <GraphCard title={'Candidatos interessados'} style={{ cursor: 'pointer' }} onClick={() => navigate('/interessados')}>
                    <ResponsiveContainer width={"100%"} minHeight={300}  >
                        <PieChart
                            style={{ cursor: 'pointer' }}
                            startAngle={180}
                            endAngle={0}
                            data={candidateGraph}
                        >

                            <Pie
                                outerRadius={100}
                                innerRadius={60}
                                dataKey={"value"}
                                data={candidateGraph}
                            >
                                {
                                    candidateGraph?.map((entry, index) => {
                                        return (
                                            <Cell key={`cell-${index}`} fill={toColor((index + 1) * 255)} />
                                        )
                                    })
                                }
                            </Pie>
                            <Tooltip
                                formatter={(v, _, { payload }) => {
                                    return [v, payload?.label]
                                }}
                            // labelFormatter={(v, payload) => {
                            //     return payload[0].payload.label
                            // }}
                            />
                            <Legend
                                iconType="square"
                                formatter={(v, entry) => {
                                    return entry.payload.label
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </GraphCard>
            </div >
        </>
    )
}