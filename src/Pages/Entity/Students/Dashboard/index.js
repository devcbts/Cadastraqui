import Card from "Components/Card";
import GraphCard from "./components/GraphCard";
import { ReactComponent as StudentManager } from 'Assets/icons/students-manager.svg'
import IconMenu from "./components/IconMenu";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Loader from "Components/Loader";
import toColor from "utils/number-to-color";
export default function EntityDashboardStudents() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchDashboard = async () => {
            setIsLoading(true)
            try {
                const information = await entityService.getStudentsDashboard()
                setData(information)

            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchDashboard()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Alunos</h1>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '64px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Card.Root >
                        <Card.Title text={'total de bolsistas'} />
                        <Card.Content >
                            <h3>{data?.count}</h3>
                        </Card.Content>
                    </Card.Root>
                    <Card.Root >
                        <Card.Title text={'bolsas integrais'} />
                        <Card.Content >
                            <h3>{data?.scholarshipPartial}</h3>
                        </Card.Content>
                    </Card.Root>
                    <Card.Root >
                        <Card.Title text={'bolsas parciais'} />
                        <Card.Content >
                            <h3>{data?.scholarshipTotal}</h3>
                        </Card.Content>
                    </Card.Root>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', }}>
                    <GraphCard title={'distribuição por unidade'} >
                        <ResponsiveContainer width={"100%"} height={200} >

                            <BarChart data={data?.units}>

                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar dataKey="count" activeBar={<Rectangle fill="red" stroke="black" />} >
                                    {
                                        data?.units?.map((entry, index) => {
                                            return (
                                                <Cell key={`cell-${index}`} fill={toColor(entry.id)} />
                                            )
                                        })
                                    }
                                </Bar>
                                <Tooltip formatter={(value, name, props) => [value, "alunos"]} />

                            </BarChart>
                        </ResponsiveContainer>
                    </GraphCard>
                    <GraphCard title={'distribuição por curso'} >
                        <ResponsiveContainer width={"100%"} height={200} >

                            <PieChart >
                                <Pie data={data?.courses} dataKey="count" nameKey="course" >
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
                    </GraphCard>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <IconMenu Icon={StudentManager} text={'gestão de alunos'} onClick={() => navigate('gestao')} />
                </div>
            </div>
        </>
    )
}