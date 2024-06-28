import { useState } from "react"
import EntityInfo from "./components/EntityInfo"
import EntityAddress from "./components/EntityAddress"
import { NotificationService } from "services/notification"
import adminService from "services/admin/adminService"
import Confirmation from "./components/Confirmation"
import entityService from "services/entity/entityService"
import Loader from "Components/Loader"

export default function AdminRegister() {
    const [page, setPage] = useState(1)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const handlePageChange = (to, data = null) => {
        if (data) {
            setData((prev) => ({ ...prev, ...data }))
        }
        setPage((prev) => prev + to)
    }
    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            const { id } = await adminService.registerEntity(data)
            setData(null)
            setPage(1)
            NotificationService.success({ text: 'Instituição criada' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setIsLoading(false)
    }
    return (
        <>
            <Loader loading={isLoading} />
            <h1>Cadastro</h1>
            {page === 1 && <EntityInfo data={data} onPageChange={handlePageChange} />}
            {page === 2 && <EntityAddress data={data} onPageChange={handlePageChange} />}
            {page === 3 && <Confirmation data={data} onPageChange={handlePageChange} onSubmit={handleSubmit} />}
        </>
    )
}