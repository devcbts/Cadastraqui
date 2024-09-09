import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import Table from "Components/Table"
import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import adminService from "services/admin/adminService"
import { NotificationService } from "services/notification"
import formatDate from "utils/format-date"

export default function AdminAccountInfoView() {
    const { state } = useLocation()
    const { userId } = useParams()
    const [account, setAccount] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const isEntity = useMemo(() => state?.accountType === "entity", [state])
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getAccountInformation(userId)
                setAccount(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)

        }
        if (userId) fetchAccount()
    }, [userId])

    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={isEntity ? 'Visualizar instituição' : 'Visualizar conta'} />
            <div style={{ padding: '32px 24px', width: 'max(600px,40%)', display: 'flex', flexDirection: 'column', margin: '0 auto 0 auto', gap: '64px' }}>
                <div style={{ textAlign: 'center' }}>
                    <h4>Dados da conta</h4>
                    <Table.Root headers={isEntity ? 4 : 1}>
                        <Table.Row>
                            <Table.Cell>Email </Table.Cell>
                            <Table.Cell>{account?.email}</Table.Cell>
                        </Table.Row>
                        {isEntity &&

                            <>
                                <Table.Row>
                                    <Table.Cell>CNPJ </Table.Cell>
                                    <Table.Cell>{account?.details.CNPJ}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Endereço </Table.Cell>
                                    <Table.Cell>{`${account?.details.address}, nº ${account?.details.addressNumber}. ${account?.details.city} - ${account?.details.UF}`}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Telefone </Table.Cell>
                                    <Table.Cell>{account?.details.phone}</Table.Cell>
                                </Table.Row>
                            </>}
                    </Table.Root>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h4>Detalhes da conta</h4>
                    <Table.Root headers={2}>
                        <Table.Row>
                            <Table.Cell>Data de criação</Table.Cell>
                            <Table.Cell>{formatDate(account?.createdAt)}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Tipo de conta</Table.Cell>
                            <Table.Cell>{account?.role}</Table.Cell>
                        </Table.Row>
                    </Table.Root>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h4>Atividades do usuário</h4>
                    <Table.Root headers={2}>
                        <Table.Row>
                            <Table.Cell>Número de acessos</Table.Cell>
                            <Table.Cell>{account?.accessCount}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Último acesso </Table.Cell>
                            <Table.Cell>{formatDate(account?.lastAccess)}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Histórico de Login </Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate("login")} />

                            </Table.Cell>
                        </Table.Row>
                        {!isEntity && <Table.Row>
                            <Table.Cell>Histórico de SAC </Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => navigate("sac")} />
                            </Table.Cell>
                        </Table.Row>}
                    </Table.Root>
                </div>
            </div>
        </>
    )
}