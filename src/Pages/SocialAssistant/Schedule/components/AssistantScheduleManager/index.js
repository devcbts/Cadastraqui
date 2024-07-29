import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Modal from "Components/Modal";
import Table from "Components/Table";
import Interview from "Pages/Entity/Register/components/Announcement/components/AnnouncementInfo/Interview";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function AssistantScheduleManager() {
    const [announcements, setAnnouncements] = useState([])
    const [announcementSchedule, setAnnouncementSchedule] = useState({ id: null, schedule: null })
    const navigate = useNavigate()
    const { state } = useLocation()
    const ref = useRef(null)
    useEffect(() => {
        // TODO: load all announcements linked with current assistant
        // if it already has schedule, call edit function
        const fetchAnnouncements = async () => {
            try {
                const information = await socialAssistantService.getAnnouncementsScheduleSummary()
                setAnnouncements(information)
            } catch (err) {
                NotificationService.error({ text: 'Erro ao carregar editais' })
            }
        }
        fetchAnnouncements()
    }, [])

    const handleCreateSchedule = async () => {
        if (!ref.current.validate()) {
            return
        }
        // TODO: call API to create schedule, returning the id of row created (update state, so user can edit after if it needs)
        try {
            const values = ref.current.values()
            if (announcementSchedule.schedule) {
                const id = announcementSchedule.schedule.id
                await socialAssistantService.updateSchedule(id, values)

            } else {
                await socialAssistantService.createSchedule(announcementSchedule.id, values)

                setAnnouncements((prev) => [...prev].map(e => {
                    return e.id === announcementSchedule.id ? { ...e, hasSchedule: true, AssistantSchedule: [values] } : e
                }))
            }
            setAnnouncementSchedule({ id: null, schedule: null })
            NotificationService.success({ text: 'Horário reservado para o edital' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handleViewSchedule = (id) => {
        navigate(id, { state })
    }

    return (
        <>
            <BackPageTitle title={'Gerenciar agenda'} onClick={() => navigate('')} />
            <Modal
                open={!!announcementSchedule?.id}
                onCancel={() => setAnnouncementSchedule({ id: null, schedule: null })}
                onConfirm={handleCreateSchedule}
                title={'Reservar horários'}
                text={'reserve os horários da agenda para este edital'}
            >
                <Interview ref={ref} data={announcementSchedule?.schedule} />
            </Modal>
            <div style={{ padding: '24px' }}>
                <Table.Root headers={['edital', 'entrevistas', 'visitas', 'ações']}>
                    {
                        announcements.map(e => (
                            <Table.Row>
                                <Table.Cell>{e.announcementName}</Table.Cell>
                                <Table.Cell>{e.interviews}</Table.Cell>
                                <Table.Cell>{e.visits}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase label={e.hasSchedule ? 'editar' : 'cadastrar'} onClick={() => setAnnouncementSchedule({ id: e.id, schedule: e.AssistantSchedule?.[0] })} />
                                    {e.hasSchedule && <ButtonBase label={'visualizar'} onClick={() => handleViewSchedule(e.id)} />}
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }

                </Table.Root>
            </div>
        </>
    )
}