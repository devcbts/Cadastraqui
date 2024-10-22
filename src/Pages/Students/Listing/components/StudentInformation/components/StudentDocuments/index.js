import SentDocuments from "Components/SentDocuments";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { NotificationService } from "services/notification";
import subscriptionService from "services/subscription/subscriptionService";

export default function StudentDocuments() {
    const { state } = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {
        if (!state.id) {
            return NotificationService.error({ text: 'Aluno não encontrado' })
        }
        const fetchDocuments = async () => {
            try {
                setIsLoading(true)
                const information = await subscriptionService.getCandidateSubscriptionDocuments(state.id)
                setData(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchDocuments()
    }, [state])
    const handleDocument = (url) => {
        window.open(url, '_blank')
    }
    return (
        <SentDocuments
            data={data}
            loading={isLoading}
            onViewDoc={handleDocument}
        />
    )
}