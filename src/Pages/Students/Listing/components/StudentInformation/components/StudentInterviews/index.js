import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import AppointmentDetails from "Components/Schedule/AppointmentDetails"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import studentService from "services/student/studentService"
import formatDate from "utils/format-date"

export default function StudentInterviews() {
    const { state } = useLocation()
    const [data, setData] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchInterviews = async () => {
            const information = await studentService.getStudentInterviews(state.candidateId)
            setData(information)
        }
        fetchInterviews()
    }, [state.candidateId])
    const [selected, setSelected] = useState(null)
    const handleBack = () => {
        if (selected) {
            return setSelected(null)
        }
        return navigate(-1)
    }
    return (
        <>
            <BackPageTitle onClick={handleBack} title={'Entrevistas do aluno'} />
            {!selected ? <Table.Root headers={['data', 'tipo', 'realizada?', 'ações']}>
                {
                    data.map(e => (
                        <Table.Row>
                            <Table.Cell>{formatDate(e.date)}</Table.Cell>
                            <Table.Cell>{e.interviewType === "Interview" ? 'Entrevista' : 'Visita'}</Table.Cell>
                            <Table.Cell>{e.InterviewRealized ? 'Sim' : 'Não'}</Table.Cell>
                            <Table.Cell><ButtonBase label={'visualizar'} onClick={() => setSelected(e)} /></Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
                : <AppointmentDetails schedule={selected} />}
        </>
    )
}