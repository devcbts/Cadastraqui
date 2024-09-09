import Card from "Components/Card"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import adminService from "services/admin/adminService"
import AdminEntityAccounts from "./components/Entity"
import AdminUserAccounts from "./components/User"

export default function AdminAccounts() {
    const [entities, setEntities] = useState([])
    const navigate = useNavigate()
    const { state } = useLocation()
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const information = await adminService.getEntities()
                setEntities(information)
            } catch (err) { }
        }
        fetchEntities()
    }, [])
    const handleChangeAccountType = (type) => {
        navigate('', { state: { ...state, accountType: type } })
    }
    return (
        <>
            {
                !state?.accountType &&
                <>
                    <h1>Gestão de Contas</h1>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', margin: '24px' }}>

                        <Card.Root onClick={() => handleChangeAccountType("entity")}>
                            <Card.Header >Contas de instituições</Card.Header>
                        </Card.Root>
                        <Card.Root onClick={() => handleChangeAccountType("user")}>
                            <Card.Header>Contas de usuários</Card.Header>
                        </Card.Root>
                    </div>
                </>
            }
            {
                state?.accountType === "entity" &&
                <AdminEntityAccounts />
            }
            {
                state?.accountType === "user" &&
                <AdminUserAccounts />
            }
        </>
    )
}