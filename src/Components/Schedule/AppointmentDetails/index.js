import { useMemo } from "react";
import AppointmentLink from "./components/AppointmentLink";
import Table from "Components/Table";
import InputBase from "Components/InputBase";
import REQUEST_TYPE from "utils/enums/request-type";

export default function AppointmentDetails({ schedule, onSaveLink = null, onChangeCommentary = null, children }) {
    const notEditable = useMemo(() => {
        if (schedule?.cancelled) {
            return 'CANCELLED'
        }
        if (schedule?.finished) {
            return 'FINISHED'
        }
        return null
    }, [schedule])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', padding: '32px', height: '100%' }}>

            <fieldset style={{ all: 'inherit' }} disabled={notEditable}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Table.Root headers={['nome', 'horário', 'tipo']}>
                        <Table.Row>
                            <Table.Cell>{schedule?.candidateName}</Table.Cell>
                            <Table.Cell>{schedule?.hour}</Table.Cell>
                            <Table.Cell>{REQUEST_TYPE[schedule?.interviewType]}</Table.Cell>
                        </Table.Row>
                    </Table.Root>
                </div>
                {schedule?.interviewType === 'Interview' && <AppointmentLink link={schedule?.interviewLink} onSave={onSaveLink} />}
                <InputBase type="text-area" label={'comentário'} value={schedule?.InterviewComentary} disabled={!onChangeCommentary} onChange={(e) => onChangeCommentary && onChangeCommentary(e.target.value)} error={null} />
                {notEditable && <span>Este agendamento foi {notEditable === 'CANCELLED' ? 'CANCELADO' : 'FINALIZADO'}</span>}
                {children}
            </fieldset>
        </div>
    )
}