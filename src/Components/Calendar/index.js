import { format, getDay, parse, startOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
export default function BigCalendar({
    events,
    onSelectEvent,
    onNavigate,
    props
}) {
    const locales = {
        'pt-BR': ptBR,
    }

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    })
    return (
        <Calendar
            style={{ color: 'black', height: '100%' }}
            culture="pt-BR"
            localizer={localizer}
            events={events}
            defaultView="month"
            messages={{ day: 'Dia', month: 'Mês', week: 'Semana', today: 'Hoje', next: 'Próximo', previous: 'Anterior', event: 'Evento', time: 'Horário', date: 'Data', noEventsInRange: 'Sem agendamentos neste intervalo' }}
            onSelectEvent={onSelectEvent}
            onNavigate={onNavigate}
            {...props}
        />
    )
}

