import BackPageTitle from "Components/BackPageTitle";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import adminService from "services/admin/adminService";

export default function AdminEntityView() {
    const { entityId } = useParams()
    const [entity, setEntity] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchEntity = async () => {
            try {
                setIsLoading(true)
                const information = await adminService.getEntityById(entityId)
                console.log(information);
                setEntity(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchEntity()
    }, [entityId])
    return (
        <div>
            <Loader loading={isLoading} />
            <BackPageTitle title={entity?.socialReason} path={-1} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textAlign: 'center' }}>Dados da Instituição</h3>
                <Table.Root headers={['', '']}>
                    <Table.Row>
                        <Table.Cell>Email</Table.Cell>
                        <Table.Cell>{entity?.email}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>CNPJ</Table.Cell>
                        <Table.Cell>{entity?.CNPJ}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Endereço</Table.Cell>
                        <Table.Cell>{entity?.address}, {entity?.addressNumber}, bairro {entity?.neighborhood}, CEP {entity?.CEP}. {entity?.city}/{entity?.UF}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Telefone</Table.Cell>
                        <Table.Cell>{entity?.phone}</Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </div>
    )
}