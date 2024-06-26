import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import adminService from "services/admin/adminService";

export default function AdminHome() {
    const [entities, setEntities] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const information = await adminService.getEntities()
                setEntities(information)
            } catch (err) { }
        }
        fetchEntities()
    }, [])
    return (
        <div>
            <h1>Início</h1>
            <h3>Entidades</h3>
            <Table.Root headers={['razão social', 'cnpj', 'ações']}>
                {
                    entities.map((entity) => (
                        <Table.Row>
                            <Table.Cell>{entity.socialReason}</Table.Cell>
                            <Table.Cell>{entity.CNPJ}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate(entity.id)} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}