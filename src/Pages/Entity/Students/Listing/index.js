import BackPageTitle from "Components/BackPageTitle";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";

export default function EntityStudentsList() {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getAllStudents()
                setData(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchStudents()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Lista de alunos'} path={-1} />
            <div style={{ padding: '24px' }}>
                {
                    data?.map(e => {
                        const { students, name } = e
                        return (
                            <>
                                <h3>{name}</h3>
                                <Table.Root headers={['nome completo', 'curso',]}>
                                    {students.map(student => (
                                        <Table.Row>
                                            <Table.Cell>{student.name}</Table.Cell>
                                            <Table.Cell>{student.course}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Root>
                            </>
                        )
                    })
                }
            </div>
        </>
    )
}