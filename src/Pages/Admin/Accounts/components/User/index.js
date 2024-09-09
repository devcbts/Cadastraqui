import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import adminService from "services/admin/adminService";
import { NotificationService } from "services/notification";

export default function AdminUserAccounts() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { state } = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getAccounts({ filter: "common" })
                setUsers(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchEntities()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={'Contas de usuários'} />
            <Table.Root headers={['nome', 'tipo', 'ações']}>
                {
                    users?.map((user) => (
                        <Table.Row>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell>{user.role}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate(user.id, { state })} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </>
    )
}