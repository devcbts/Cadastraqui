import ButtonBase from "Components/ButtonBase";
import DataTable from "Components/DataTable";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import adminService from "services/admin/adminService";

export default function AdminHome() {
    const [data, setData] = useState({
        entities: [],
        total: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const fetchEntities = async ({ page, size } = {}) => {
        try {
            setIsLoading(true)
            const information = await adminService.getEntities({ page, size })
            setData(information)
        } catch (err) { }
        setIsLoading(false)
    }
    // useEffect(() => {
    //     fetchEntities()
    // }, [])
    return (
        <>
            <h1>Início</h1>
            <Loader loading={isLoading} />
            <DataTable
                allowPagination
                serverSide
                title={'Entidades'}
                totalItems={data.total}
                columns={[
                    { accessorKey: 'socialReason', header: 'Razão social' },
                    { accessorKey: 'CNPJ', header: 'CNPJ' },
                    {
                        id: 'actions', header: 'Ações', cell: ({ row: { original: entity } }) => <ButtonBase label={'visualizar'} onClick={() => navigate(entity.id)} />
                    },
                ]}
                data={data.entities}
                onDataRequest={(index, count,) => fetchEntities({ page: index, size: count })}
            />
        </>
    )
}