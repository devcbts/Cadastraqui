import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import InputBase from "Components/InputBase"
import Table from "Components/Table"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import AppointmentLink from "../AppointmentLink"
import UndoneScheduleModal from "./UndoneScheduleModal"

export default function AssistantCandidateSchedule() {
    const { scheduleId } = useParams()
    const [status, setStatus] = useState(null)
    useEffect(() => {
        // TODO: get current information to populate fields
    }, [])

    return (
        <>
            <BackPageTitle title={'Detalhes do agendamento'} path={-1} />
            <UndoneScheduleModal open={status === 'undone'} onConfirm={() => { }} onClose={() => setStatus(null)} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Table.Root headers={['nome', 'horário', 'tipo']}>
                        <Table.Row>
                            <Table.Cell>Gabriel</Table.Cell>
                            <Table.Cell>19:00</Table.Cell>
                            <Table.Cell>Entrevista</Table.Cell>
                        </Table.Row>
                    </Table.Root>
                    <AppointmentLink link={'https://meet.google.com/teste'} />
                </div>
                <InputBase type="text-area" label={'comentário'} error={null} />
                <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', justifyContent: 'center' }}>
                    <ButtonBase label={'não realizada'} onClick={() => setStatus('undone')} />
                    <ButtonBase label={'realizada'} onClick={() => setStatus('done')} />
                </div>
            </div>
        </>
    )
}