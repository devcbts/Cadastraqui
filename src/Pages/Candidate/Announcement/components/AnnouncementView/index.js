import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import AnnouncementList from "./components/AnnouncementList";
import AnnouncementSelect from "./components/AnnouncementSelect";
import AnnouncementContext from "./context/announcementContext";
import { useSearchParams } from "react-router-dom";
export default function AnnouncementView() {
    const { entityId, announcementId } = useParams()
    const [query, setQuery] = useSearchParams()
    const [currentAnnouncementId, setCurrentAnnouncementId] = useState(announcementId ?? null)
    const [currentStep, setCurrentStep] = useState('INITIAL')
    const navigate = useNavigate()
    useEffect(() => {
        // TODO: fetch announcement data based on ID provided on URL
    }, [])

    const isViewingEntity = entityId && !announcementId

    const handleAnnouncementSelection = (id = null) => {
        if (isViewingEntity) {
            if (!id) {
                query.delete('curso')
                setQuery(query)
            } else {
                setQuery('curso', id)
            }
            setCurrentAnnouncementId(id)
        } else {
            navigate('/home')
        }

    }

    return (
        <AnnouncementContext.Provider value={{ id: currentAnnouncementId, clear: handleAnnouncementSelection, step: currentStep, move: setCurrentStep }}>
            {isViewingEntity && (!query.get('curso') ? <AnnouncementList onSelect={handleAnnouncementSelection} /> : <AnnouncementSelect />)}
            {(!isViewingEntity && query.get('curso')) && <AnnouncementSelect />}
        </AnnouncementContext.Provider>
    )
}