import BackPageTitle from "Components/BackPageTitle";
import Calendar from "react-calendar";
import { useLocation, useNavigate } from "react-router";
import 'react-calendar/dist/Calendar.css';
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { NotificationService } from "services/notification";
import { useState } from "react";
export default function AssistantAnnouncementSchedule() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [currentDate, setCurrentDate] = useState(new Date())
    const handleBack = () => {
        if (state?.scheduleView) {
            return navigate('/agenda', { state: { scheduleView: 'manager' } })
        }
        return navigate('/agenda')
    }
    const handleReject = () => {
        NotificationService.confirm({
            title: 'Recusar agendamento?',
            text: 'O candidato precisará reagendar o compromisso'
        })
    }
    const handleViewCandidateSchedule = (scheduleId) => {
        navigate(`../candidato/${scheduleId}`)
    }
    return (
        <>
            <BackPageTitle title={'Agenda do edital'} onClick={handleBack} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px', height: '100%' }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', minHeight: '300px', maxHeight: '40%' }}>
                    <Calendar
                        onClickDay={(date) => setCurrentDate(date)}
                    />
                    <div style={{ overflowY: 'scroll' }}>

                        <Table.Root headers={['horário', 'candidato', 'tipo', 'ação']}>
                            {Array.from({ length: 10 }).map(_ => (
                                <Table.Row>
                                    <Table.Cell divider>19:00</Table.Cell>
                                    <Table.Cell>Gabriel</Table.Cell>
                                    <Table.Cell>Entrevista</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => handleViewCandidateSchedule('1233')} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Root>
                    </div>
                </div>

                <Table.Root headers={['candidato', 'inscrição', 'tipo', 'data', 'horário', 'ações']}>
                    <Table.Row>
                        <Table.Cell>Gabriel</Table.Cell>
                        <Table.Cell>00001</Table.Cell>
                        <Table.Cell>Entrevista</Table.Cell>
                        <Table.Cell>27/10/2024</Table.Cell>
                        <Table.Cell>19:00</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'aceitar'} />
                            <ButtonBase label={'recusar'} danger onClick={handleReject} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </>
    )
}