import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import adminService from "services/admin/adminService";

export default function AdminEntityAccounts() {
    const [entities, setEntities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { state } = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getEntities()
                setEntities(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchEntities()
    }, [])
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
                                <ButtonBase label={'visualizar'} onClick={() => navigate(entity.user_id, { state })} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </>
    )
}