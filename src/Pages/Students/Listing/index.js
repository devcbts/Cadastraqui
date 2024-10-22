import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import entityService from "services/entity/entityService";
import studentService from "services/student/studentService";

export default function StudentList() {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true)
                const information = await studentService.getAllStudents()
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
                                <Table.Root headers={['nome completo', 'curso', 'tipo de bolsa', 'ações']}>
                                    {students.map(student => (
                                        <Table.Row>
                                            <Table.Cell>{student.name}</Table.Cell>
                                            <Table.Cell>{student.course}</Table.Cell>
                                            <Table.Cell>{student.isPartial ? 'Parcial' : 'Integral'}</Table.Cell>
                                            <Table.Cell>
                                                <ButtonBase label={'visualizar'} onClick={() => navigate(`${student.id}`)} />
                                            </Table.Cell>
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