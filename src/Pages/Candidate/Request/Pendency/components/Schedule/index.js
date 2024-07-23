import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import formatDate from "utils/format-date";

export default function Schedule() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [currentDate, setCurrentDate] = useState({ date: '', times: [] })
    const [scheduleTo, setScheduleTo] = useState(null)
    useEffect(() => {
        // TODO: check current schedule status, if it's approved or not, finished or not
        // and display to user the current status and disable the schedule button
    }, [])
    const dates = [
        { date: '2020-10-10', times: ['19:00', '19:30', '20:00', '21:00', '21:30'] },
        { date: '2022-10-10', times: ['16:00', '16:30', '21:00', '22:00', '22:30'] },
        { date: '2023-10-10', times: ['13:00', '13:30', '20:00', '21:00', '21:30'] },
        { date: '2023-10-10', times: ['13:00', '13:30', '20:00', '21:00', '21:30'] },
        { date: '2023-10-10', times: ['13:00', '13:30', '20:00', '21:00', '21:30'] },
        { date: '2023-10-10', times: ['13:00', '13:30', '20:00', '21:00', '21:30'] },
        { date: '2023-10-10', times: ['13:00', '13:30', '20:00', '21:00', '21:30'] },
        { date: '2023-10-10', times: ['13:00', '13:30', '20:00', '21:00', '21:30'] },
    ]
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
                                            label={e}
                                            onClick={() => setScheduleTo({ date: currentDate.date, time: e })}
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
                <ButtonBase label={'agendar'} />
            </div>

        </ >
    )
}