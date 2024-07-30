import BigCalendar from "Components/Calendar";
import Loader from "Components/Loader";
import { toDate } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import REQUEST_TYPE from "utils/enums/request-type";

export default function CandidateSchedule() {
    const [isLoading, setIsLoading] = useState(true)
    const [schedule, setSchedule] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getSchedules()
                setSchedule(information.map(e => {
                    return ({
                        start: toDate(e.date),
                        end: toDate(e.endDate),
                        title: `${REQUEST_TYPE[e.interviewType]} - ${e.candidateName}`,
                        resource: e
                    })
                }))
            } catch (err) {
                NotificationService.error({ text: 'Erro ao buscar agenda' })
            }
            setIsLoading(false)
        }
        fetchSchedules()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Agenda</h1>
            <div style={{ padding: '32px', height: '100%' }}>
                <BigCalendar
                    events={schedule}
                    onSelectEvent={(event) => {
                        navigate(event.resource.id)
                    }}
                />
            </div>
        </>
    )
}