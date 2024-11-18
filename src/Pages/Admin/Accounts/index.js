import Card from "Components/Card"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import adminService from "services/admin/adminService"
import AdminUserAccounts from "./components/User"
import MenuCard from "Components/MenuCard"
import { ReactComponent as Users } from 'Assets/icons/users.svg'
import { ReactComponent as Institution } from 'Assets/icons/institution.svg'
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

                        <MenuCard
                            onClick={() => handleChangeAccountType("entities")}
                            Icon={Institution}
                            title={'instituições'}
                            description={'Veja informações das instituições cadastradas'} />
                        <MenuCard
                            onClick={() => handleChangeAccountType("common")}
                            Icon={Users}
                            description={'Veja informações dos usuários do sistema'}
                            title={'usuários'}
                        />
                    </div>
                </>
            }
            {
                state?.accountType &&
                <AdminUserAccounts />
            }
        </>
    )
}