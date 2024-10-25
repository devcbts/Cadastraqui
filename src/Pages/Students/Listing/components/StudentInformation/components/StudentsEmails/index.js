import BackPageTitle from "Components/BackPageTitle"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { NotificationService } from "services/notification"
import studentService from "services/student/studentService"
import formatDate from "utils/format-date"

export default function StudentEmails() {
    const { state } = useLocation()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        if (!state.studentId) {
            NotificationService.error({ text: 'ID do estudante inválido' }).then(_ => navigate(-1))
        }
        const fetchEmails = async () => {
            try {
                const information = await studentService.getEmails(state?.studentId)
                setData(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }

        }
        fetchEmails()
    }, [state])
    return (
        <>
            <BackPageTitle path={-1} title={'Emails do aluno'} />
            <Table.Root headers={['enviado em', 'tipo']}>
                {
                    data.map(e => (
                        <Table.Row>
                            <Table.Cell>{formatDate(e.createdAt)}</Table.Cell>
                            <Table.Cell>{e.type}</Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>

        </>
    )
}