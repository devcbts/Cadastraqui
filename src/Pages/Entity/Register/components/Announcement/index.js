import { useState } from "react"
import AnnouncementInfo from "./components/AnnouncementInfo"

export default function Announcement() {
    const [page, setPage] = useState(1)
    const [data, setData] = useState(null)
    const handleDataChange = (data) => {
        setData((prev) => ({ ...prev, ...data }))
    }
    const handlePageChange = (to, data = null) => {
        if (data) {
            handleDataChange(data)
        }
        setPage((prev) => prev + to)
    }
    return (
        <div>
            {page === 1 && <AnnouncementInfo onPageChange={handlePageChange} />}
        </div>
    )
}