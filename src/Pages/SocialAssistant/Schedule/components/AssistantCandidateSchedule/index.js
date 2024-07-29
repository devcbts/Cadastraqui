import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import InputBase from "Components/InputBase"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import AppointmentLink from "../AppointmentLink"
import UndoneScheduleModal from "./UndoneScheduleModal"
import { NotificationService } from "services/notification"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import REQUEST_TYPE from "utils/enums/request-type"
import { useDebouncedCallback } from "use-debounce"
import Loader from "Components/Loader"

export default function AssistantCandidateSchedule() {
    const { announcementId, scheduleId } = useParams()
    const [status, setStatus] = useState(null)
    const [schedule, setSchedule] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const debounce = useDebouncedCallback(
        (v) => handleSaveComment(v),
        1000
    )
    useEffect(() => {
        // TODO: get current information to populate fields
        const fetchSchedule = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getAnnouncementSchedule(announcementId, scheduleId)
                setSchedule(information.data.schedule)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchSchedule()
    }, [])
    const handleSaveLink = async (newLink) => {
        try {
            await socialAssistantService.updateInterview(scheduleId, { link: newLink })
            NotificationService.success({ text: 'Link salvo' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao salvar link da reunião' })
        }
    }

    const handleSaveComment = async (comment) => {
        try {
            await socialAssistantService.updateInterview(scheduleId, { InterviewComentary: comment })
        } catch (err) {
        }
    }
    const handleInterviewStatus = async (values) => {
        try {
            let data;
            if (values) {
                data = { InterviewRealized: false, InterviewNotRealizedReason: values.reason, InterviewNotRealizedComentary: values.comment }
            } else {
                data = { InterviewRealized: true }
            }
            await socialAssistantService.updateInterview(scheduleId, data)
            NotificationService.success({ text: 'Status alterado' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao alterar o status' })
        }
    }
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Detalhes do agendamento'} path={-1} />
            <UndoneScheduleModal open={status === 'undone'} onConfirm={handleInterviewStatus} onClose={() => setStatus(null)} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Table.Root headers={['nome', 'horário', 'tipo']}>
                        <Table.Row>
                            <Table.Cell>{schedule?.candidateName}</Table.Cell>
                            <Table.Cell>{schedule?.hour}</Table.Cell>
                            <Table.Cell>{REQUEST_TYPE[schedule?.interviewType]}</Table.Cell>
                        </Table.Row>
                    </Table.Root>
                    <AppointmentLink link={schedule?.interviewLink} onSave={handleSaveLink} />
                </div>
                <InputBase type="text-area" label={'comentário'} value={schedule?.InterviewComentary} onChange={(e) => debounce(e.target.value)} error={null} />
                <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', justifyContent: 'center' }}>
                    <ButtonBase label={'não realizada'} onClick={() => setStatus('undone')} danger />
                    <ButtonBase label={'realizada'} onClick={() => {
                        setStatus('done')
                        handleInterviewStatus()
                    }
                    } />
                </div>
            </div>
        </>
    )
}