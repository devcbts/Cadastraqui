import { useEffect, useMemo, useState } from "react"
import EntityStudentsRenewProcessEducationSelect from "./components/EducationSelect"
import EntityStudentsRenewProcessCoursesSelect from "./components/CoursesSelect"
import BackPageTitle from "Components/BackPageTitle"
import entityService from "services/entity/entityService"
import EntityStudentsRenewConfirmCourses from "./components/ConfirmCourses"
import AnnouncementInfo from "Pages/Entity/Register/components/Announcement/components/AnnouncementInfo"
import ANNOUNCEMENT_TYPE from "utils/enums/announcement-types"
import AnnouncementAssist from "Pages/Entity/Register/components/Announcement/components/AnnouncementAssist"
import AnnouncementFinish from "Pages/Entity/Register/components/Announcement/components/AnnouncementFinish"
import { NotificationService } from "services/notification"
import Loader from "Components/Loader"

export default function EntityStudentsRenewProcess() {
    const [page, setPage] = useState(0)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [units, setUnits] = useState([])
    const [courses, setCourses] = useState([])
    const handleStepSubmit = (v) => {
        setData((prev) => {
            if (prev?.educationType !== v?.educationType && !!v?.educationType) {
                return { educationType: v.educationType }
            }
            return ({ ...prev, ...v })
        })
        if (page < 5) {
            setPage((prev) => prev + 1)
        }
    }
    const handleBackPage = useMemo(() => {
        if (page === 0) {
            return { path: -1 }
        }

        return { onClick: () => setPage((prev) => prev - 1) }
    }, [page])
    const handlePageChange = (n, d) => {
        if (n < 0) {
            return handleBackPage.onClick()
        }
        return handleStepSubmit(d)
    }
    useEffect(() => {
        const fetchUnitsAndCourses = async () => {
            try {
                setIsLoading(true)
                const [units, courses] = await Promise.all([
                    entityService.getEntityInfo(),
                    entityService.getRenewCourses()
                ])
                console.log(courses)
                setUnits(() => {
                    const subs = units?.EntitySubsidiary?.map((e) => ({ label: e.socialReason, value: e.id }))
                    subs?.push({ label: units?.socialReason, value: units.entity_id })
                    console.log('SUBS', subs)
                    return subs
                })
                setCourses(courses)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchUnitsAndCourses()
    }, [])
    const handleSubmit = async (data) => {
        const educationalLevels = data.selectedCourses.map(e => ({
            ...e,
            name: e.course,
            id: null,
            level: data.educationType,
            verifiedScholarships: parseInt(e.verifiedScholarships),
            typeOfScholarship: e.scholarshipType,
            semester: parseInt(e.semester ?? 0),
            entity_subsidiary_id: e.entity
        }))

        try {
            setIsLoading(true)
            const announcement = await entityService.createAnnouncement({ ...data, educationalLevels })
            if (announcement) {
                const formData = new FormData()
                formData.append('file', data.file)
                await entityService.uploadAnnouncementPDF(announcement.id, formData)
            }
            setPage(0)
            setData(null)
            NotificationService.success({ text: 'Edital criado' })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setIsLoading(false)
    }
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Processo de renovação'} {...handleBackPage} />
            {{
                0: <EntityStudentsRenewProcessEducationSelect onSubmit={handleStepSubmit} />,
                1: <EntityStudentsRenewProcessCoursesSelect data={data} units={units} courses={courses} onSubmit={handleStepSubmit} />,
                2: <EntityStudentsRenewConfirmCourses courses={data?.selectedCourses} onSubmit={handleStepSubmit} data={data} />,
                3: <AnnouncementInfo data={data} onPageChange={handlePageChange} educationType={data?.educationType} announcementType={"PeriodicVerification"} />,
                4: <AnnouncementAssist data={data} onPageChange={handlePageChange} returnPage={false} />,
                5: <AnnouncementFinish data={data} onPageChange={handlePageChange} onSubmit={handleSubmit} returnPage={false} />
            }[page]}

        </>
    )
}