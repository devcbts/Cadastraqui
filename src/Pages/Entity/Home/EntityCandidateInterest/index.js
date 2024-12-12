import Card from "Components/Card/CardRoot";
import GraphCard from "Pages/Students/Dashboard/components/GraphCard";
import { useNavigate } from "react-router";
import { Bar, BarChart, Cell, Legend, Rectangle, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import toColor from "utils/number-to-color";

export default function EntityCandidateInterest({ announcementInterest, candidateInterest
}) {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate('/interessados')
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", gap: '12px' }}>
                <Card title={'Inscritos'} onClick={handleNavigate}>
                    {candidateInterest?.numberOfApplications}
                </Card>
                <Card title={'Interessados'} onClick={handleNavigate}>
                    {candidateInterest?.totalNumberOfInterested}
                </Card>
                <Card title={'Cadastro completo'} onClick={handleNavigate}>
                    {candidateInterest?.numberOfFinishedRegistration}
                </Card>
                <Card title={'Cadastro incompleto'} onClick={handleNavigate}>
                    {candidateInterest?.numberOfUnfinishedRegistration}
                </Card>
            </div>
            <GraphCard
                title={'Candidatos interessados por edital'}
                style={{ marginTop: '24px' }}
            >
                <ResponsiveContainer width={"100%"} minHeight={300} >
                    <BarChart
                        width={500}
                        height={500}
                        data={announcementInterest}
                    >
                        <Legend payload={announcementInterest?.map(e => {
                            return ({ value: e.name, color: toColor(e.id) })
                        }) ?? []}
                            layout="vertical"
                            align="left"
                            verticalAlign="top"
                        />
                        {/* <XAxis dataKey={"name"} /> */}
                        <YAxis />
                        <Tooltip formatter={(value, name) => {
                            return [value, "interessados"]
                        }}
                            labelFormatter={(_, payload) => {
                                return payload?.[0]?.payload.name
                            }}
                        />
                        <Bar dataKey="numberOfInterested" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="black" />} >
                            {
                                announcementInterest?.map((entry, index) => {
                                    return (
                                        <Cell key={`cell-${index}`} fill={toColor(entry.id)} />
                                    )
                                })
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </GraphCard>
        </div>
    )
}