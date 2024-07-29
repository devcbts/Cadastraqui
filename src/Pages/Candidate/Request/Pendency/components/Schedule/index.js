import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import formatDate from "utils/format-date";

export default function Schedule() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { applicationId } = useParams()
    // times is composed by { id: '', time: '' }
    const [currentDate, setCurrentDate] = useState({ date: '', times: [] })
    const [scheduleTo, setScheduleTo] = useState(null)
    const [dates, setDates] = useState([])
    useEffect(() => {
        // TODO: check current schedule status, if it's approved or not, finished or not
        // and display to user the current status and disable the schedule button
        const fetchAvailableDates = async () => {
            try {
                const infotmation = await candidateService.getAvailableSchedule(applicationId)
                setDates(infotmation)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        if (applicationId) fetchAvailableDates()
    }, [])
    const handleSchedule = async () => {
        if (!scheduleTo?.id) {
            return
        }
        try {
            await candidateService.createSchedule(scheduleTo.id, { applicationId, interviewType: state?.schedule })
            navigate(-1)
            NotificationService.success({ text: 'Agendamento concluído' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        < >
            <BackPageTitle title={state?.schedule === 'Interview' ? 'Agendar entrevista' : 'Agendar visita domiciliar'} onClick={() => navigate('')} />
            <div style={{ display: 'flex', flexDirection: 'column', margin: '50px 0px', width: '100%', alignItems: 'center', gap: '32px' }}>
                <div style={{ width: 'max(50%,360px)', height: '200px', border: '2px solid grey', placeSelf: 'center', borderRadius: '8px', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: 'max(40%,220px)', overflowY: 'scroll', height: '100%', padding: '16px', gap: '16px', alignItems: 'center', }}>
                        {
                            dates?.map(e => (
                                <ButtonBase
                                    label={formatDate(e.date)}
                                    onClick={() => setCurrentDate(e)}
                                />
                            ))
                        }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'scroll', padding: '16px', gap: '16px' }}>
                        <span style={{ textAlign: 'center' }}>{
                            currentDate.date
                                ? `Horários em ${formatDate(currentDate.date)}`
                                : 'Selecione uma data'
                        }</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, clamp(60px,20%,25%))', gap: '20px', margin: 'auto', width: '100%' }}>
                            {
                                currentDate?.times?.map(e => (
                                    <div style={{ margin: 'auto' }}>
                                        <ButtonBase
                                            label={e.time}
                                            onClick={() => setScheduleTo({ date: currentDate.date, time: e.time, id: e.id })}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <h3>
                    {scheduleTo
                        ? `Você selecionou o dia ${formatDate(scheduleTo.date)} às ${scheduleTo.time}`
                        : 'Selecione uma data e hora de agendamento'
                    }
                </h3>
                <ButtonBase label={'agendar'} onClick={handleSchedule} />
            </div>

        </ >
    )
}