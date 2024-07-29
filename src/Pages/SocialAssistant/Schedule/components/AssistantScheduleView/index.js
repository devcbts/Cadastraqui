import BackPageTitle from "Components/BackPageTitle";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, getDay, parse, startOfWeek, toDate, isFirstDayOfMonth, isLastDayOfMonth } from "date-fns";
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/sass/styles.scss';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import REQUEST_TYPE from "utils/enums/request-type";
import BigCalendar from "Components/Calendar";
export default function AssistantScheduleView() {
    const navigate = useNavigate()
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const information = await socialAssistantService.getSchedule()
                setEvents(information.data.schedule.map((e => {
                    return ({
                        start: toDate(e.date),
                        end: toDate(e.endDate),
                        title: `${REQUEST_TYPE[e.interviewType]} - ${e.candidateName}`,
                        resource: e
                    })
                })))
            } catch (err) { }
        }
        fetchSchedule()
    }, [])
    return (
        <>
            <BackPageTitle title={'Ver agenda'} onClick={() => navigate('')} />
            <div style={{ padding: '50px', height: '100%' }}>
                <BigCalendar
                    events={events}
                    onSelectEvent={(info) => {
                        navigate(`${info.resource.announcement_id}/candidato/${info.resource.id}`)
                    }}
                    onNavigate={(date, view, action) => {
                        if (action === 'NEXT' && isFirstDayOfMonth(date)) {
                            console.log('primeiro')
                        }
                        if (action === 'PREV' && isLastDayOfMonth(date)) {
                            console.log('ultimo')
                        }
                    }}

                />
            </div>
        </>
    )
}