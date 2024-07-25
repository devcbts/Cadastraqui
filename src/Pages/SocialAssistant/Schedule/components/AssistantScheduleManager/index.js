import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Modal from "Components/Modal";
import Table from "Components/Table";
import Interview from "Pages/Entity/Register/components/Announcement/components/AnnouncementInfo/Interview";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function AssistantScheduleManager() {
    const [schedules, setSchedules] = useState([])
    const [announcementSchedule, setAnnouncementSchedule] = useState(null)
    const navigate = useNavigate()
    const { state } = useLocation()
    const ref = useRef(null)
    useEffect(() => {
        // TODO: load all announcements linked with current assistant
        // if it already has schedule, call edit function
    }, [])
    const handleEditSchedule = async () => {
        // TODO: call API to update current schedule date and time

    }
    const handleCreateSchedule = async () => {
        // TODO: call API to create schedule, returning the id of row created (update state, so user can edit after if it needs)
    }
    const handleViewSchedule = (id = '123') => {
        navigate(id, { state })
    }

    return (
        <>
            <BackPageTitle title={'Gerenciar agenda'} onClick={() => navigate('')} />
            <Modal
                open={!!announcementSchedule}
                onCancel={() => setAnnouncementSchedule(null)}
                onConfirm={() => ref.current?.validate()}
                title={'Reservar horários'}
                text={'reserve os horários da agenda para este edital'}
            >
                <Interview ref={ref} />
            </Modal>
            <div style={{ padding: '24px' }}>

                <Table.Root headers={['edital', 'entrevistas', 'visitas', 'ações']}>
                    <Table.Row>
                        <Table.Cell>Edital teste</Table.Cell>
                        <Table.Cell>20</Table.Cell>
                        <Table.Cell>10</Table.Cell>

                        <Table.Cell>
                            <ButtonBase label={'cadastrar'} onClick={() => setAnnouncementSchedule(true)} />
                            <ButtonBase label={'visualizar'} onClick={handleViewSchedule} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </>
    )
}