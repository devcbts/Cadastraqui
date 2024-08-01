import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import SubsidiaryModal from "./SubdidiaryModal";

export default function Subsidiaries() {
    const [subsidiaries, setSubsidiaries] = useState([])
    const [selection, setSelection] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const entity = await entityService.getEntityInfo()
                setSubsidiaries(entity.EntitySubsidiary)
            } catch (err) { }
        }
        fetchData()
    }, [])
    const handleDelete = async (subsidiary) => {
        const { id, socialReason } = subsidiary
        NotificationService.confirm({
            title: 'Excluir filial?',
            text: `Você está excluindo ${socialReason}`,
            onConfirm: async () => {
                try {

                    await entityService.deleteSubsidiary(id)
                    NotificationService.success({ text: 'Filial excluída' })
                    setSubsidiaries((prev) => prev.filter(e => e.id !== id))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }
            }
        })
    }
    const handleClose = (data) => {
        if (data) {
            setSubsidiaries((prev) => prev.map(e => {
                if (e.id === selection.id) {
                    return { ...e, ...data }
                }
                return e
            }))
        }
        setSelection(null)
    }
    return (
        <div>
            <SubsidiaryModal data={selection} onClose={handleClose} onSubmit={() => { }}></SubsidiaryModal>
            <h3>Filiais</h3>
            <Table.Root headers={['nome', 'endereço', 'ações']}>
                {
                    subsidiaries.map((subsidiary) => {
                        const { address, city, addressNumber } = subsidiary
                        const completeAddress = `${address}, ${addressNumber}. ${city}`
                        return (
                            <Table.Row>
                                <Table.Cell>{subsidiary.socialReason}</Table.Cell>
                                <Table.Cell>{completeAddress}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase label={'editar'} onClick={() => setSelection(subsidiary)} />
                                    <ButtonBase label={'excluir'} danger onClick={() => handleDelete(subsidiary)} />
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Root>
        </div>
    )
}