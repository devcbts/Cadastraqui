import Card from "Components/Card";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import entityService from "services/entity/entityService";

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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
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
            <div>
                <h3>Distribuição por unidade</h3>
                <div style={{ display: 'flex', justifyContent: 'center', width: "max(400px,100%)", height: "200px", alignItems: 'center' }}>
                    <ResponsiveContainer width={"40%"}>
                        <BarChart
                            width={500}
                            height={300}
                            data={data?.unitVacancies}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [value, "inscritos"]} />
                            <Bar dataKey="applicants" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="black" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}