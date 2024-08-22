import BackPageTitle from "Components/BackPageTitle";
import Calendar from "react-calendar";
import { useLocation, useNavigate, useParams } from "react-router";
// import 'react-calendar/dist/Calendar.css';
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { NotificationService } from "services/notification";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import REQUEST_TYPE from "utils/enums/request-type";
import Loader from "Components/Loader";
import formatDate from "utils/format-date";
import UndoneScheduleModal from "../AssistantCandidateSchedule/UndoneScheduleModal";
import styles from './styles.module.scss'
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import './calendar.styles.scss'
export default function AssistantAnnouncementSchedule() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { announcementId } = useParams()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(true)
    const [schedule, setSchedule] = useState()
    const [days, setDays] = useState({ start: null, end: null })
    const [rejectionId, setRejectionId] = useState(null)
    const handleBack = () => {
        if (state?.scheduleView) {
            return navigate('/agenda', { state: { scheduleView: 'manager' } })
        }
        return navigate('/agenda')
    }
    const handleReject = (values) => {
        NotificationService.confirm({
            title: 'Cancelar agendamento?',
            text: 'O candidato precisará reagendar o compromisso',
            onConfirm: async () => {
                try {
                    await socialAssistantService.rejectAppointment(rejectionId, {
                        rejectReason: values.reason,
                        rejectComentary: values.comment
                    })
                    setRejectionId(null)
                    setSchedule(prev => ({ ...prev, [currentDate]: prev?.[currentDate]?.filter(e => e.id !== rejectionId) }))
                    NotificationService.success({ text: 'Compromisso cancelado' })
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }
            }
        })
    }
    const handleViewCandidateSchedule = (scheduleId) => {
        navigate(`../${announcementId}/candidato/${scheduleId}`)
    }

    useEffect(() => {
        const fetchAnnouncementSchedule = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getAnnouncementSchedule(announcementId)
                setSchedule(information.data.schedules)
                setDays(information.data.reservedDays)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchAnnouncementSchedule()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <UndoneScheduleModal title={'Cancelamento'} open={!!rejectionId} onClose={() => setRejectionId(null)} onConfirm={handleReject} />
            <BackPageTitle title={'Agenda do edital'} onClick={handleBack} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', minHeight: '300px', maxHeight: '40%' }}>
                    <Calendar
                        tileClassName={({ date }) => {
                            return (date.toISOString() >= days.start && date.toISOString() <= days.end) ? styles.tile : ''
                        }}
                        next2Label={null}
                        prev2Label={null}
                        navigationLabel={({ date }) => format(date, 'LLLL yyyy', { locale: ptBR })}

                        minDate={new Date()}
                        defaultActiveStartDate={days?.start && new Date(days?.start)}
                        onClickDay={(date) => setCurrentDate(date?.toISOString().split('T')[0])}
                    />
                </div>
                <div style={{ overflowY: 'scroll', height: '100%' }}>
                    {!schedule?.[currentDate]?.length
                        ? <span>Nenhuma entrevista/visita marcada para este dia ({formatDate(currentDate)})</span>
                        : (<Table.Root headers={['horário', 'candidato', 'tipo', 'ação']}>
                            {schedule?.[currentDate]?.map(e => (
                                <Table.Row key={e.id}>
                                    <Table.Cell divider>{e.hour}</Table.Cell>
                                    <Table.Cell>{e.candidateName}</Table.Cell>
                                    <Table.Cell>{REQUEST_TYPE[e.interviewType]}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => handleViewCandidateSchedule(e.id)} />
                                        {!e.finished && <ButtonBase label={'recusar'} danger onClick={() => setRejectionId(e.id)} />}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Root>)
                    }
                </div>

                {/* <Table.Root headers={['candidato', 'inscrição', 'tipo', 'data', 'horário', 'ações']}>
                    <Table.Row>
                        <Table.Cell>Gabriel</Table.Cell>
                        <Table.Cell>00001</Table.Cell>
                        <Table.Cell>Entrevista</Table.Cell>
                        <Table.Cell>27/10/2024</Table.Cell>
                        <Table.Cell>19:00</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'aceitar'} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Root> */}
            </div>
        </>
    )
}