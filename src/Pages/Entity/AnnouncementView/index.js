import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Card from "Components/Card";
import Loader from "Components/Loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import entityService from "services/entity/entityService";
import formatDate from "utils/format-date";
import SocialAssistantSelection from "./components/SocialAssistantSelection";
import { NotificationService } from "services/notification";
import Courses from "./components/Courses";
import InterestCards from "Components/Announcement/InterestCards";

export default function EntityAnnouncementView() {
    const { announcementId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [announcement, setAnnouncement] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getAnnouncementById(announcementId)
                setAnnouncement(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [announcementId])
    const handleLinkCopy = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_BASE_URL}/edital/${announcementId}`)
    }

    return (
        <div>
            <Loader loading={isLoading} />
            <BackPageTitle title={`Edital  - ${announcement?.announcementName ?? ''}`} path={-1} />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', margin: '16px 0px' }}>
                <ButtonBase label={'copiar link'} onClick={handleLinkCopy} />
                <Link to={announcement?.pdf} target="_blank">
                    <ButtonBase label={'PDF'} />
                </Link>
            </div>
            <InterestCards announcementId={announcement?.id} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span>Vigência do edital: {formatDate(announcement?.announcementBegin)} à {formatDate(announcement?.announcementDate, { utc: false })}</span>
                    <span>Período de inscrição: {formatDate(announcement?.openDate)} à {formatDate(announcement?.closeDate, { utc: true })}</span>
                    <span>
                        {
                            announcement?.interview !== null
                                ? `Período de avaliação: ${formatDate(announcement?.interview?.startDate)} à ${formatDate(announcement?.interview?.endDate)}`
                                : `Não há período de avaliação`
                        }
                    </span>
                    <span>Total de vagas: {announcement?.verifiedScholarships}</span>
                </div>
                {/* <Card title={'candidatos inscritos'}>
                    {announcement?.Application.length}
                </Card> */}
            </div>
            <SocialAssistantSelection assistants={announcement?.socialAssistant} announcementId={announcementId} />
            <Courses courses={announcement?.educationLevels} />
        </div>
    )
}