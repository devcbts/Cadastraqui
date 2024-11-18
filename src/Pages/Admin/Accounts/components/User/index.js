import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import DataTable from "Components/DataTable";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import adminService from "services/admin/adminService";
import { NotificationService } from "services/notification";
import ROLES from "utils/enums/role-types";

export default function AdminUserAccounts() {
    const [data, setUsers] = useState({ accounts: [], total: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const { state } = useLocation()
    const navigate = useNavigate()
    const fetchUsers = async ({ search, page, size, type } = {}) => {
        try {
            setIsLoading(true)
            const information = await adminService.getAccounts({ filter: state.accountType, search, page, size, type })
            setUsers(information)
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setIsLoading(false)
    }
    useEffect(() => {
        if (!!state.accountType) {
            fetchUsers()
        }
    }, [state.accountType])
    const handleChangeAccountStatus = (id) => {
        const onConfirm = async () => {
            try {
                await adminService.changeAccountActiveStatus(id)
                setUsers((prev) => (
                    {
                        ...prev,
                        accounts: [...prev.accounts].map(e => e.id === id ? { ...e, isActive: !e.isActive } : e)
                    }
                ))
                NotificationService.success({ text: 'Status da conta alterado' })
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        const user = data.accounts.find(e => e.id === id)
        const action = user.isActive ? 'inativar' : 'ativar'
        NotificationService.confirm({
            onConfirm,
            title: `${action.replace(/^./, x => x.toUpperCase())} conta?`,
            text: `Isso irá ${action} a conta de "${isEntity ? user.socialReason : user.name}"`
        })

    }
    const isEntity = state?.accountType === "entities"
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={isEntity ? 'Contas de instituições' : 'Contas de usuários'} />
            <DataTable
                data={data.accounts}
                allowPagination
                serverSide
                totalItems={data.total}
                onDataRequest={(index, count, search, type) => fetchUsers({ search, size: count, page: index, type })}
                enableFilters
                columns={[
                    { accessorKey: isEntity ? 'socialReason' : 'name', header: 'Nome', meta: { filterKey: 'usuário' } },
                    !isEntity && { id: 'role', header: 'Tipo', cell: ({ row: { original: user } }) => ROLES[user.role] },
                    {
                        id: 'actions', header: 'Ações', cell: ({ row: { original: user } }) => <>
                            <ButtonBase label={'visualizar'} onClick={() => navigate(user.id, { state })} />
                            <ButtonBase label={!user.isActive ? 'ativar' : 'inativar'} onClick={() => handleChangeAccountStatus(user.id)} danger={user.isActive} />
                        </>
                    }
                ].filter(Boolean)}
            />

        </>
    )
}