import { useEffect, useState } from "react"
import AnnouncementInfo from "./components/AnnouncementInfo"
import AnnouncementCourses from "./components/AnnouncementCourses"
import Loader from "Components/Loader"
import entityService from "services/entity/entityService"
import AnnouncementAssist from "./components/AnnouncementAssist"
import AnnouncementFinish from "./components/AnnouncementFinish"
import { NotificationService } from "services/notification"

export default function Announcement() {
    const [page, setPage] = useState(1)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [entity, setEntity] = useState(null)
    const handleDataChange = (data) => {
        setData((prev) => ({ ...prev, ...data }))
    }
    const handlePageChange = (to, data = null) => {
        if (data) {
            handleDataChange(data)
        }
        setPage((prev) => prev + to)
    }
    useEffect(() => {
        const fetchEntity = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getEntityInfo()
                setEntity(information)
                setIsLoading(false)
            } catch (err) { }
        }
        fetchEntity()
    }, [])
    const handleSubmit = async (data) => {
        try {
            await entityService.createAnnouncement(data)
            // setPage(1)
            // setData(null)
            NotificationService.success({ text: 'Edital criado' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <Loader loading={isLoading} />
            {page === 1 && <AnnouncementInfo data={data} onPageChange={handlePageChange} />}
            {page === 2 && <AnnouncementCourses data={data} entity={entity} onPageChange={handlePageChange} />}
            {page === 3 && <AnnouncementAssist data={data} onPageChange={handlePageChange} />}
            {page === 4 && <AnnouncementFinish data={data} onPageChange={handlePageChange} onSubmit={handleSubmit} />}
        </>
    )
}