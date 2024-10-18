import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import adminService from "services/admin/adminService";
import { NotificationService } from "services/notification";
import ROLES from "utils/enums/role-types";

export default function AdminUserAccounts() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { state } = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getAccounts({ filter: "common" })
                setUsers(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchUsers()
    }, [])
    const handleChangeAccountStatus = (id) => {
        const onConfirm = async () => {
            try {
                await adminService.changeAccountActiveStatus(id)
                setUsers((prev) => (
                    [...prev].map(e => e.id === id ? { ...e, isActive: !e.isActive } : e)
                ))
                NotificationService.success({ text: 'Status da conta alterado' })
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        const user = users.find(e => e.id === id)
        const action = user.isActive ? 'inativar' : 'ativar'
        NotificationService.confirm({
            onConfirm,
            title: `${action.replace(/^./, x => x.toUpperCase())} conta?`,
            text: `Isso irá ${action} a conta de "${user.name}"`
        })

    }
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={'Contas de usuários'} />
            <Table.Root headers={['nome', 'tipo', 'ações']}>
                {
                    users?.map((user) => (
                        <Table.Row key={user.id}>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell>{ROLES[user.role]}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate(user.id, { state })} />
                                <ButtonBase label={!user.isActive ? 'ativar' : 'inativar'} onClick={() => handleChangeAccountStatus(user.id)} danger={user.isActive} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </>
    )
}