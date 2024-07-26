import BackPageTitle from "Components/BackPageTitle";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import HistoryCard from "../HistoryCard";
import Loader from "Components/Loader";

export default function ApplicationHistory() {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { applicationId } = useParams()
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getHistory(applicationId)
                setHistory(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        if (applicationId) fetchHistory()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Histórico da inscrição'} path={-1} />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', placeSelf: 'center', minWidth: 'min(100%, 800px)', gap: '24px' }}>

                {
                    history.map(e => (
                        <HistoryCard history={e} />
                    ))
                }
            </div>
        </>
    )
}