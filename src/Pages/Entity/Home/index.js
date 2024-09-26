import Card from "Components/Card";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import entityService from "services/entity/entityService";
import toColor from "utils/number-to-color";

const data = [
    { name: 'Matriz 01', applicants: 150 }
]
export default function EntityHome() {
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await entityService.getDashboard()
                setData(information)
            } catch (err) { }
        }
        fetchData()
    }, [])
    return (
        <div>
            <h1>Início</h1>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', }}>
                <Card.Root width="clamp(160px,230px,20%)">
                    <Card.Title text={'editais abertos'}></Card.Title>
                    <Card.Content>
                        {data?.announcements}
                    </Card.Content>
                </Card.Root>
                <Card.Root width="clamp(160px,230px,20%)">
                    <Card.Title text={'vagas abertas'}></Card.Title>
                    <Card.Content>
                        {data?.vacancies}
                    </Card.Content>
                </Card.Root>
                <Card.Root width="clamp(160px,230px,20%)">
                    <Card.Title text={'candidatos inscritos'}></Card.Title>
                    <Card.Content>
                        {data?.subscriptions}
                    </Card.Content>
                </Card.Root>
            </div>
            <div style={{ marginTop: '64px' }}>
                <h3>Distribuição por unidade</h3>
                <div style={{ display: 'flex', justifyContent: 'center', width: "max(400px,100%)", height: "200px", alignItems: 'center' }}>
                    <ResponsiveContainer width={"40%"}>
                        <BarChart
                            width={500}
                            height={300}
                            data={data?.unit}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [value, "inscritos"]} />
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
                <h3>Distribuição por curso</h3>
                <div style={{ display: 'flex', justifyContent: 'center', width: "max(400px,100%)", height: "200px", alignItems: 'center' }}>
                    <ResponsiveContainer width={"40%"}>
                        <PieChart>

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