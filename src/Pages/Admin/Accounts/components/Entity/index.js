import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import adminService from "services/admin/adminService";
import { NotificationService } from "services/notification";

export default function AdminEntityAccounts() {
    const [entities, setEntities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { state } = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getAccounts({ filter: "entities" })
                setEntities(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchEntities()
    }, [])
    const handleChangeAccountStatus = async (id) => {
        try {
            await adminService.changeAccountActiveStatus(id)
            setEntities((prev) => (
                [...prev].map(e => e.id === id ? { ...e, isActive: !e.isActive } : e)
            ))
            NotificationService.success({ text: 'Status da conta alterado' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={'Contas de instituições'} />
            <Table.Root headers={['razão social', 'cnpj', 'ações']}>
                {
                    entities.map((entity) => (
                        <Table.Row>
                            <Table.Cell>{entity.socialReason}</Table.Cell>
                            <Table.Cell>{entity.CNPJ}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate(entity.id, { state })} />
                                <ButtonBase label={!entity.isActive ? 'ativar' : 'inativar'} onClick={() => handleChangeAccountStatus(entity.id)} danger={entity.isActive} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </>
    )
}