import { useEffect, useState } from "react"
import AnnouncementInfo from "./components/AnnouncementInfo"
import AnnouncementCourses from "./components/AnnouncementCourses"
import Loader from "Components/Loader"
import entityService from "services/entity/entityService"
import AnnouncementAssist from "./components/AnnouncementAssist"
import AnnouncementFinish from "./components/AnnouncementFinish"
import { NotificationService } from "services/notification"

export default function Announcement({ announcementType, educationType = null }) {
    const [page, setPage] = useState(1)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [entity, setEntity] = useState(null)
    const [courses, setCourses] = useState([])
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
                const information = await entityService.getEntityInfo()
                setEntity(information)
            } catch (err) { }
        }
        const fetchCourses = async () => {
            try {
                const information = await entityService.getAllCourses()
                setCourses(information)
            } catch (err) { }
        }
        (async () => {
            setIsLoading(true)
            await Promise.all([
                fetchCourses(),
                fetchEntity()
            ])
            setIsLoading(false)
        })()

    }, [])
    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            const announcement = await entityService.createAnnouncement(data)
            if (announcement) {
                const formData = new FormData()
                formData.append('file', data.file)
                await entityService.uploadAnnouncementPDF(announcement.id, formData)
            }
            setPage(1)
            setData(null)
            NotificationService.success({ text: 'Edital criado' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setIsLoading(false)
    }
    return (
        <>
            <Loader loading={isLoading} />
            {page === 1 && <AnnouncementInfo
                announcementType={announcementType}
                educationType={educationType}
                data={data}
                onPageChange={handlePageChange}
            />}
            {page === 2 && <AnnouncementCourses data={data} allCourses={courses} entity={entity} onPageChange={handlePageChange} />}
            {page === 3 && <AnnouncementAssist data={data} onPageChange={handlePageChange} />}
            {page === 4 && <AnnouncementFinish data={data} onPageChange={handlePageChange} onSubmit={handleSubmit} />}
        </>
    )
}