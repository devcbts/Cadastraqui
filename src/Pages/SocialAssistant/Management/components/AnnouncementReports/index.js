import Card from "Components/Card"
import { useLocation, useNavigate, useParams } from "react-router"
import TotalOrPartialReport from "../Reports/TotalOrPartial"
import NominalReport from "../Reports/Nominal"
import AssistantManagerBenefits from "../Benefits"
import { useEffect, useState } from "react"
import Loader from "Components/Loader"
import { NotificationService } from "services/notification"
import socialAssistantService from "services/socialAssistant/socialAssistantService"

export default function AssistantManagerAnnouncementReports() {
    const { state } = useLocation()
    const { announcementId } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [announcement, setAnnouncement] = useState(null)
    useEffect(() => {
        const fetchAnnouncementData = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getAnnouncementById(announcementId)
                setAnnouncement(information)

            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message }).then(_ => navigate(-1))
            }
            setIsLoading(false)
        }
        fetchAnnouncementData()
    }, [])

    const handleChangeReportType = (type) => {
        navigate('', { state: { ...state, reportType: type, announcement } })
    }
    return (
        <>
            <Loader loading={isLoading} />
            {
                !state?.reportType && (
                    <div>
                        <h3>Relatórios</h3>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', marginTop: '32px' }}>
                            <Card onClick={() => handleChangeReportType('default')} title={'geral ou parcial'} />
                            <Card onClick={() => handleChangeReportType('nominal')} title={'nominal de bolsistas'} />
                            <Card onClick={() => handleChangeReportType('benefits')} title={'tipo de benefícios'} />
                        </div>
                    </div>
                )
            }
            {
                state?.reportType === 'default' && <TotalOrPartialReport />
            }
            {
                state?.reportType === 'nominal' && <NominalReport />
            }
            {
                state?.reportType === 'benefits' && <AssistantManagerBenefits />
            }

        </>
    )
}