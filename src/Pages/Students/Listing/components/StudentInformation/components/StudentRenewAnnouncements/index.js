import BackPageTitle from "Components/BackPageTitle"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import entityService from "services/entity/entityService"
import studentService from "services/student/studentService"
import formatDate from "utils/format-date"

export default function StudentRenewAnnouncements() {
    const { state } = useLocation()
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchInterviews = async () => {
            const information = await studentService.getStudentRenewAnnouncements(state.candidateId)
            setData(information)
        }
        fetchInterviews()
    }, [state.candidateId])
    return (
        <>
            <BackPageTitle path={-1} title={'Renovações do aluno'} />
            <Table.Root headers={['data de abertura', 'edital']}>
                {
                    data.map(e => (
                        <Table.Row>
                            <Table.Cell>{formatDate(e.announcementBegin)}</Table.Cell>
                            <Table.Cell>{e.announcementName}</Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </>
    )
}