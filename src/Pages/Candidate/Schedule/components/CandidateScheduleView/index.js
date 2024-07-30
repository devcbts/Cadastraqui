import BackPageTitle from "Components/BackPageTitle";
import BigCalendar from "Components/Calendar";
import AppointmentDetails from "Components/Schedule/AppointmentDetails";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";

export default function CandidateScheduleView() {
    const { scheduleId } = useParams()
    const [schedule, setSchedule] = useState(null)
    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const information = await candidateService.getScheduleById(scheduleId)
                setSchedule(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        fetchInterview()
    }, [])
    return (
        <>
            <BackPageTitle path={-1} title={'Detalhes do agendamento'} />
            <AppointmentDetails
                schedule={schedule}

            />
        </>
    )
}