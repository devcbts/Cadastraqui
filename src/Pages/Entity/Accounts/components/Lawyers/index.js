import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";

export default function Lawyers() {
    const [members, setMembers] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await entityService.getLawyers()
                setMembers(response.lawyers)
            } catch (err) {

            }
        }
        fetchData()
    }, [])
    const handleRemove = async (member) => {
        const { role, id, name } = member
        NotificationService.confirm({
            title: 'Excluir advogado?',
            text: `Você está excluindo ${name}`,
            onConfirm: async () => {
                try {
                    await entityService.deleteLawyer(id)
                    NotificationService.success({ text: 'Advogado excluído' })
                    setMembers((prev) => prev.filter(e => e.id !== id))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }

            }
        })
    }


    return (
        <div>

            <h3>Advogados</h3>
            <Table.Root headers={['nome', 'função', 'ações']}>
                {
                    members.map((member) => (
                        <Table.Row>
                            <Table.Cell align="left">{member.name}</Table.Cell>
                            <Table.Cell>Advogado</Table.Cell>
                            <Table.Cell>
                                {/* <ButtonBase label={'editar'} onClick={() => setSelection(member)} /> */}
                                <ButtonBase label={'excluir'} danger onClick={() => handleRemove(member)} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}