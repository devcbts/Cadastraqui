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
            <BackPageTitle title={"Edital"} path={-1} />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', margin: '16px 0px' }}>
                <ButtonBase label={'copiar link'} onClick={handleLinkCopy} />
                <Link to={announcement?.pdf} target="_blank">
                    <ButtonBase label={'PDF'} />
                </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span>Período de inscrição: {formatDate(announcement?.openDate)} à {formatDate(announcement?.closeDate)}</span>
                    <span>Período de avaliação: {formatDate(announcement?.closeDate)} à {formatDate(announcement?.announcementDate)}</span>
                    <span>Vigência do edital: {formatDate(announcement?.announcementDate)}</span>
                    <span>Total de vagas: {announcement?.verifiedScholarships}</span>
                </div>
                <Card.Root>
                    <Card.Title text={'candidatos inscritos'} />
                    <Card.Content>
                        <h1>{announcement?.Application.length}</h1>
                    </Card.Content>
                </Card.Root>
            </div>
            <SocialAssistantSelection assistants={announcement?.socialAssistant} announcementId={announcementId} />
            <Courses courses={announcement?.educationLevels} />
        </div>
    )
}