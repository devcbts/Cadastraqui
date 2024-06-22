import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import AssistantModal from "Pages/Entity/AnnouncementView/components/SocialAssistantSelection/components/AssistantModal";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import DirectorModal from "./DirectorModal";

export default function Members() {
    const [members, setMembers] = useState([])
    const [selection, setSelection] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assistants, directors] = await Promise.all([
                    entityService.getAvailableAssistants(),
                    entityService.getDirectors()
                ])
                const mappedArr = assistants
                    .map((e) => ({ ...e, role: 'assistente' }))
                    .concat(directors.map((e) => ({ ...e, role: 'diretor' })))
                setMembers(mappedArr)
            } catch (err) {

            }
        }
        fetchData()
    }, [])
    const handleRemove = async (role, id) => {
        NotificationService.confirm({
            title: 'Excluir colaborador?',
            onConfirm: async () => {
                try {
                    if (role === 'assistente') {
                        await entityService.deleteAssistant(id)
                    } else {
                        await entityService.deleteDirector(id)
                    }
                    NotificationService.success({ text: 'Colaborador excluído' })
                    setMembers((prev) => prev.filter(e => e.id !== id))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }

            }
        })
    }
    const handleClose = () => {
        setSelection(null)
    }
    const handleUpdate = (data) => {
        setMembers((prev) => prev.map(e => {
            if (e.user_id === data.user_id) {
                return { ...e, ...data }
            }
            return e
        }))
    }
    return (
        <div>
            {selection?.role === "assistente" ? <AssistantModal data={selection} onClose={handleClose} onUpdate={handleUpdate} />
                : <DirectorModal data={selection} onClose={handleClose} onUpdate={handleUpdate} />
            }
            <h3>Status dos colaboradores</h3>
            <Table.Root headers={['nome', 'status', 'ações']}>
                {
                    members.map((member) => (
                        <Table.Row>
                            <Table.Cell>{member.name}</Table.Cell>
                            <Table.Cell>{member.role}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'editar'} onClick={() => setSelection(member)} />
                                <ButtonBase label={'excluir'} danger onClick={() => handleRemove(member.role, member.id)} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}