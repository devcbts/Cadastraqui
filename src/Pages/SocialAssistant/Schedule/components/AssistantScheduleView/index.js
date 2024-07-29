import BackPageTitle from "Components/BackPageTitle";
import { Calendar, dateFnsLocalizer, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/sass/styles.scss';
import { useNavigate } from "react-router";
export default function AssistantScheduleView() {
    const navigate = useNavigate()
    dayjs.locale('br')
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
        <>
            <BackPageTitle title={'Ver agenda'} onClick={() => navigate('')} />
            <div style={{ padding: '50px', height: '100%' }}>
                <Calendar
                    style={{ color: 'black', height: '100%' }}
                    culture="pt-BR"
                    localizer={localizer}
                    events={[{ start: new Date('2024-07-29T00:00:00'), title: 'Testando', end: dayjs().toDate(), resource: { description: 'evento teste', status: 'aprovado' } }]}
                    defaultView="agenda"
                    titleAccessor={(e) => {
                        return `${e.resource.description} - ${e.resource.status}`
                    }}
                    messages={{ day: 'Dia', month: 'Mês', week: 'Semana', today: 'Hoje', next: 'Próximo', previous: 'Anterior', event: 'Evento', time: 'Horário', date: 'Data' }}
                    onSelectEvent={(info) => {
                    }}
                />
            </div>
        </>
    )
}