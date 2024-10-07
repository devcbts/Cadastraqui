import Card from "Components/Card";
import Loader from "Components/Loader";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import entityService from "services/entity/entityService";
import toColor from "utils/number-to-color";

export default function EntityHome() {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const information = await entityService.getDashboard()
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    return (
        <div>
            <Loader loading={isLoading} />
            <h1>Início</h1>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
                <Card title={'editais abertos'}>

                    {data?.announcements}
                </Card>
                <Card title={'vagas abertas'}>

                    {data?.vacancies}
                </Card>
                <Card title={'candidatos inscritos'}>

                    {data?.subscriptions}
                </Card>
            </div>
            <div style={{ marginTop: '64px' }}>
                <h3>Distribuição de inscritos por unidade</h3>
                <div style={{ display: 'flex', justifyContent: 'center', width: "max(400px,100%)", height: '250px', alignItems: 'center' }}>
                    <ResponsiveContainer width={"80%"}  >
                        <BarChart
                            width={500}
                            height={500}
                            data={data?.unit}
                        >
                            <Legend payload={data?.unit?.map(e => {
                                return ({ value: e.name, color: toColor(e.id) })
                            }) ?? []}
                                layout="vertical"
                                align="left"
                                verticalAlign="top"
                            />
                            <CartesianGrid />
                            <XAxis />
                            <YAxis />
                            <Tooltip formatter={(value, name) => {
                                return [value, "inscritos"]
                            }}
                                labelFormatter={(_, payload) => {
                                    return payload?.[0]?.payload.name
                                }}
                            />
                            <Bar dataKey="applicants" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="black" />} >
                                {
                                    data?.unit.map((entry, index) => {
                                        return (
                                            <Cell key={`cell-${index}`} fill={toColor(entry.id)} />
                                        )
                                    })
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <h3>Distribuição de inscritos por curso</h3>
                <div style={{ display: 'flex', justifyContent: 'center', width: "max(400px,100%)", height: "200px", alignItems: 'center' }}>
                    <ResponsiveContainer width={"80%"}>
                        <PieChart>
                            <Legend payload={data?.courses?.map(e => {
                                return ({ value: e.name, color: toColor(e.id) })
                            }) ?? []}
                                layout="vertical"
                                align="left"
                                verticalAlign="top"
                            />
                            <Pie
                                width={500}
                                height={300}
                                data={data?.courses}
                                dataKey={"applicants"}
                                outerRadius={100}
                                innerRadius={60}
                                spacing={0}
                            >
                                {
                                    data?.courses.map((entry, index) => {
                                        return (
                                            <Cell key={`cell-${index}`} fill={toColor(entry.id)} />
                                        )
                                    })
                                }
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [value, name]} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}