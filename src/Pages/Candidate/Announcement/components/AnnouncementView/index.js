import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AnnouncementList from "./components/AnnouncementList";
import AnnouncementSelect from "./components/AnnouncementSelect";
import AnnouncementContext from "./context/announcementContext";
import { useSearchParams } from "react-router-dom";
import candidateService from "services/candidate/candidateService";
import Loader from "Components/Loader";
import { NotificationService } from "services/notification";
export default function AnnouncementView() {
    const { announcementId } = useParams()
    const [query, setQuery] = useSearchParams()
    const [currentAnnouncementId, _] = useState(announcementId ?? null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [currentStep, setCurrentStep] = useState('INITIAL')
    const navigate = useNavigate()
    const [announcement, setAnnouncement] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchAnnouncement = async () => {
            setIsLoading(true)
            try {
                const information = await candidateService.getAnnouncementById(currentAnnouncementId)
                setAnnouncement(information)
            } catch (err) {
                NotificationService.error({ text: 'Erro ao carregar edital. Tente novamente' })
                navigate('/home')
            }
            setIsLoading(false)
        }
        fetchAnnouncement()
    }, [currentAnnouncementId])

    const handleCourseSelection = (item = null) => {
        if (announcementId) {
            if (!item) {
                query.delete('curso')
                setQuery(query)
            } else {
                const course = item.course
                query.set('curso', course.id)
                setQuery(query)
                setSelectedCourse(item)
            }
        } else {
            navigate('/home')
        }

    }
    return (
        <AnnouncementContext.Provider value={{
            id: currentAnnouncementId,
            getCourse: selectedCourse,
            setCourse: setSelectedCourse,
            clear: handleCourseSelection,
            step: currentStep,
            move: setCurrentStep,
            announcement
        }}>
            <Loader text="Carregando informações do edital" loading={isLoading} />
            {
                !query.get('curso')
                    ? <AnnouncementList announcement={announcement} onSelect={handleCourseSelection} />
                    : <AnnouncementSelect announcement={announcement} />
            }
        </AnnouncementContext.Provider>
    )
}