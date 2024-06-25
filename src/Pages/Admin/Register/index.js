import { useState } from "react"
import EntityInfo from "./components/EntityInfo"
import EntityAddress from "./components/EntityAddress"
import { NotificationService } from "services/notification"
import adminService from "services/admin/adminService"
import Confirmation from "./components/Confirmation"
import entityService from "services/entity/entityService"

export default function AdminRegister() {
    const [page, setPage] = useState(1)
    const [data, setData] = useState(null)
    const handlePageChange = (to, data = null) => {
        if (data) {
            setData((prev) => ({ ...prev, ...data }))
        }
        setPage((prev) => prev + to)
    }
    const handleSubmit = async (data) => {
        try {
            const { id } = await adminService.registerEntity(data)
            setData(null)
            setPage(1)
            NotificationService.success({ text: 'Instituição criada' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <h1>Cadastro</h1>
            {page === 1 && <EntityInfo data={data} onPageChange={handlePageChange} />}
            {page === 2 && <EntityAddress data={data} onPageChange={handlePageChange} />}
            {page === 3 && <Confirmation data={data} onPageChange={handlePageChange} onSubmit={handleSubmit} />}
        </>
    )
}